const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const KEY=process.env.SECRET_KEY;
const User=require('../models/users.model.js');

module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization)
        return res.status(401).json({error:'You are not logged in'});
    const token=authorization.replace('Bearer ','');
    jwt.verify(token,KEY,(error,payload)=>{
        if(error)
            return res.status(401).json({error:'You are not logged in'});
        
        const {_id}=payload;
        User.findById(_id)
        .then((savedUser)=>{
            req.user=savedUser
            next()
        });
    });
    
}