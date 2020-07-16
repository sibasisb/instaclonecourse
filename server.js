const express=require('express');
const app=express();
const mongoose=require('mongoose');


require('dotenv').config();
const authRouter=require('./routes/auth.js');
const postRouter=require('./routes/posts.js');
const profileRouter=require('./routes/profiles.js');
const PORT=process.env.PORT||5000;
const URI=process.env.ATLAS;
const cors=require('cors');
mongoose.connect(URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Connected to mongodb atlas');
});
app.use(cors());
app.use(express.json());
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/profile',profileRouter);

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'));
    const path=require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

app.listen(PORT,()=>{console.log('Server is running on port number' + PORT)});