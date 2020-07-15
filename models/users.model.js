const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{type:String,
    required:true,
    unique:true,
    trim:true},
    email:{type:String,
        required:true},
    password:{type:String,
        required:true},
    followers:[{type:ObjectId,ref:'users'}],
    following:[{type:ObjectId,ref:'users'}],
    pic:{type:String,default:'https://images.unsplash.com/photo-1514846077057-2a9a07633aba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80'}
});

const Users=mongoose.model('users',userSchema);
module.exports=Users;