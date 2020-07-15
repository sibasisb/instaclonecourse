import React,{useState,useEffect} from 'react';
import M from 'materialize-css';
import "../App.css";
import{useHistory} from 'react-router-dom';

const CreatePost=()=>{
    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");
    const history=useHistory();
    useEffect(()=>{
        if(url){
        fetch("/post/createpost",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":"Bearer " + localStorage.getItem("jwt") 
                },
                body:JSON.stringify({
                    title,
                    body,
                    photo:url
                })
                }).then(res=>res.json())
                .then(data=>{
                    if(data.error){
                        M.toast({html: data.error,classes:"#e53935 red darken-1"})
                    }
                    else{
                        M.toast({html: "Uploaded post",classes:"#43a047 green darken-1"});
                        history.push('/');
                    }
        })
        }
    },[url])

    const PostDetails=()=>{

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

    }



    return (
        <div className="card input-field" 
        style={{margin:"20px auto",padding:"10px",maxWidth:"800px",textAlign:"center"}}
        >
            <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button onClick={()=>PostDetails()} className="btn waves-effect waves-light #42a5f5 blue darken-1">Add Post</button>
        </div>
    );
}

export default CreatePost;