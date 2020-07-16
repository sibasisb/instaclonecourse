const router=require('express').Router();
const mongoose=require('mongoose');
const User=require('../models/users.model.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const KEY=process.env.SECRET_KEY;
const requireLogin=require('../middlewares/requireLogin.js');



router.route('/').get((req,res)=>{
    res.json('Authentication page');
});

router.route('/signin').post((req,res)=>{
    const {email,password}=req.body;
    if(!email||!password)
        return res.status(422).json({error:'Empty field'});
    User.findOne({email:email})
    .then(users=>{
        if(!users)
            return res.status(422).json({error:'Invalid user id or password'});
        bcrypt.compare(password,users.password)
        .then(doesMatch=>{
            if(doesMatch){
                const token=jwt.sign({_id:users._id},KEY);
                const {_id,name,followers,following,pic}=users;
                return res.json({token,user:{_id,email,name,followers,following,pic}});
            }
            return res.status(422).json({error:'Invalid user id or password'});
        })
        .catch(err=>console.log(err));    
        
    })
    .catch(err=>res.status(400).json('Error'+err));
});


router.route('/signup').post((req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name || !password || !email)
        return res.status(422).json({error:'Empty creds'});
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser)
            return res.status(422).json({error:'User id already exists'});
        
        bcrypt.hash(password,12)
        .then(hashed=>{
            
            const newUser=new User({name:name,email:email,password:hashed,pic:pic});
            newUser.save()
            .then(()=>{res.json({message:'New user added'})})
            .catch(err=>res.status(400).json('Error:'+err));
        });
        
    })
    .catch(err=>console.log(err));
    
});

router.route('/protected').get(requireLogin,(req,res)=>{
    res.send('Hello user');
})


module.exports=router;