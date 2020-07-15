const router=require('express').Router();
const mongoose=require('mongoose');
const Posts=require('../models/posts.model.js');
const requireLogin = require('../middlewares/requireLogin.js');
//const Users = require('../models/users.model.js');

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,photo}=req.body;

    if(!title || !body ||!photo){
        return res.status(422).json({error:'Fill body and title and upload image'});
    }
    
    req.user.password=undefined;
    const post=new Posts({title,body,photo,postedBy:req.user});
    post.save()
    .then((result)=>res.json({result}))
    .catch(error=>res.status(421).json({error}));
})

router.get('/posts',requireLogin,(req,res)=>{
    Posts.find()
    .populate('comments.commentedBy','_id name')
    .populate('postedBy','_id name')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>console.log(err))
})

router.get('/subposts',requireLogin,(req,res)=>{
    Posts.find({postedBy:{$in:req.user.following}})
    .populate('comments.commentedBy','_id name')
    .populate('postedBy','_id name')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>console.log(err))
})

router.get('/myposts',requireLogin,(req,res)=>{
    Posts.find({postedBy:req.user._id})
    .populate('comments.commentedBy','_id name')
    .populate('postedBy','_id name')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>console.log(err))
})

router.put('/like',requireLogin,(req,res)=>{
    const {postId}=req.body;
    Posts.findByIdAndUpdate(postId)
    .populate('postedBy','_id name')
    .then(post=>{
        post.likes.push(req.user._id);
        post.save()
        .then(result=>res.json({result}))
        .catch(error=>res.json({error}));
    })
    .catch(err=>console.log(err));
})

router.put('/unlike',requireLogin,(req,res)=>{
    const {postId}=req.body;
    Posts.findByIdAndUpdate(postId)
    .populate('postedBy','_id name')
    .then(post=>{
        post.likes.pop(req.user._id);
        post.save()
        .then(result=>res.json({result}))
        .catch(error=>res.json({error}));
    })
    .catch(err=>console.log(err));
})

router.put('/comment',requireLogin,(req,res)=>{
    const {text,postId}=req.body;
    Posts.findByIdAndUpdate(postId)
    .populate('comments.commentedBy','_id name')
    .populate('postedBy','_id name')
    .then(post=>{
        post.comments.push({text:text,commentedBy:req.user});
        post.save()
        .then(result=>res.json({result}))
        .catch(error=>res.json({error}));
    })
    .catch(err=>console.log(err));
})

router.delete('/deletePost/:postId',requireLogin,(req,res)=>{

    Posts.findById(req.params.postId)
    .populate('postedBy','_id name')
    .then((post)=>{
        if(req.user._id.toString()==post.postedBy._id.toString()){
            Posts.findByIdAndDelete(req.params.postId)
            .then((p)=>{
                return res.json({post:p})
            })
            .catch(error=>{
                return res.json({error})
            })
        }
        else
            return res.json({error:"Error"})
    })
    .catch(error=>res.json({error}));
})

module.exports=router;