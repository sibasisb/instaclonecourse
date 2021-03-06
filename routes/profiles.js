const router=require('express').Router();
const mongoose=require('mongoose');
const Posts=require('../models/posts.model.js');
const requireLogin = require('../middlewares/requireLogin.js');
const User=require('../models/users.model.js');

router.get('/:id',requireLogin,(req,res)=>{
    User.findById(req.params.id)
    .select('-password')
    .then(user=>{
        Posts.find({postedBy:req.params.id})
        .populate('postedBy','_id name')
        .populate('comments.postedBy','_id name')
        .then(posts=>{
            return res.json({user,posts});
        })
        .catch(error=>res.status(421).json({error}));
    })
    .catch(error=>res.status(404).json({error}));
})

router.put('/follow',requireLogin,(req,res)=>{
    const {followedId}=req.body;
    User.findByIdAndUpdate(followedId)
    .populate('follower','_id')
    .populate('following','_id')
    .then(u1=>{
        u1.follower.push(req.user._id);
        u1.save()
        .then(()=>{
            User.findByIdAndUpdate(req.user._id)
            .populate('follower','_id name')
            .populate('following','_id name')
            .then(user2=>{
                user2.following.push(followedId);
                user2.save()
                .then((u2)=>{
                    return res.json({follower:u2});
                })
                .catch(err=>res.json({error:err}))
            })
            .catch(error=>res.json({error}));
        })
        .catch(erro=>res.json({error:erro}));
    })
    .catch(e=>res.json({error:e}));

    

})


router.put('/unfollow',requireLogin,(req,res)=>{
    const {unfollowedId}=req.body;
    User.findByIdAndUpdate(unfollowedId)
    .populate('follower','_id')
    .populate('following','_id')
    .then(user1=>{
        let idx=req.user._id;
        user1.follower.splice(idx,1);
        user1.save()
        .then(()=>{
            User.findByIdAndUpdate(req.user._id)
            .populate('follower','_id name')
            .populate('following','_id name')
            .then(u2=>{
                let i=unfollowedId;
                u2.following.splice(i,1);        
                u2.save()
                .then((user2)=>{
                    return res.json({unfollower:user2});
                })
                .catch(err=>res.json({error:err}))
            })
            .catch(error=>res.json({error}));
        })
        .catch(erro=>res.json({error:erro}));
    })
    .catch(e=>res.json({error:e}));

})

router.put('/updatepic',requireLogin,(req,res)=>{
    const {pic}=req.body;
    User.findByIdAndUpdate(req.user._id)
    .select('-password')
    .then(users=>{
        users.pic=pic;
        users.save()
        .then(u=>{
            return res.json({user:u});
        })
        .catch(err=>res.status(422).json({error:err}));
    })
    .catch(error=>res.status(404).json({error}));
});

module.exports=router; 