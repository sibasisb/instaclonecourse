import React,{useState, useEffect} from 'react';
import '../App.css';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Signup=()=>{
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined);
    const history=useHistory();

    useEffect(()=>{
        if(url){
            PostDetails();
        }
    },[url]);

    const UploadPic=()=>{
        const fdata=new FormData();
        fdata.append("file",image);
        fdata.append("upload_preset","instaclone");
        fdata.append("cloud_name","dwnc45rgy");
        fetch("https://api.cloudinary.com/v1_1/dwnc45rgy/image/upload",{
            method:"POST",
            body:fdata
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
            
        })
        .catch(err=>console.log(err));
    };


    const PostDetails=()=>{
        fetch("/auth/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"})
            }
            else{
                M.toast({html: data.message,classes:"#43a047 green darken-1"});
                history.push('/Login');
            }
        })
    }

    const PostData=()=>{
        if(image){
            UploadPic();
        }
        else{
            PostDetails();
        }
    }

    return (
        <div className="mycard">
        <div className="card myauth input-field">
            <h2>Instaclone</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
                <span>Set Profile Picture</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>

            <button onClick={()=>PostData()} className="btn waves-effect waves-light #42a5f5 blue darken-1">Sign Up</button><br/>
            <h5><Link to="Login">Already have an account?</Link></h5>
        </div>
        </div>
    );
}

export default Signup;