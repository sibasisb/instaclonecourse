import React, { useEffect, useState, useContext } from 'react';
import '../App.css';
import { UserContext } from '../App';
//import {BrowserRouter,Route} from 'react-router-dom';

const Profile=()=>{
    const [pics,setPics]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined);
    
    useEffect(()=>{
        fetch("/post/myposts",{
            method:"GET",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(results=>{
            setPics(results.posts);
        })
        .catch(err=>console.log(err));
    },[])

    useEffect(()=>{
        if(image){
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
                
                fetch("/profile/updatepic",{
                    method:"PUT",
                    headers:{
                        "authorization":"Bearer "+localStorage.getItem("jwt"),
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({pic:data.url})
                })
                .then(res=>res.json())
                .then(results=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:results.user.pic}));
                    dispatch({type:"UPDATEPIC",payload:{pic:results.user.pic}});                    
                    console.log(results.user);
                })
                .catch(err=>console.log(err));                
                
            })
            .catch(err=>console.log(err));
        }
    },[image]);

    const UploadPic=(file)=>{
        if(file)
            setImage(file);
        
    }


    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                }}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state?state.pic:'Loading..'}
                    />
                </div>
                <div>
                    <h5>{state?state.name:"Loading.."}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                        <h6> {pics.length} Posts </h6>
                        <h6> {state?state.followers.length:"0"} Followers </h6>
                        <h6> {state?state.following.length:"0"} Following </h6>
                    </div>
                </div>
                </div>
    
            <div className="file-field input-field" style={{margin:"10px"}}>
                <div className="btn waves-effect waves-light #42a5f5 blue darken-1">
                <span>Update Profile Picture</span>
                <input type="file" onChange={(e)=>UploadPic(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            </div>
            <div className="gallery">
                {
                    pics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>            
                        )
                    })
                }
                
            </div>
        </div>
    );
}

export default Profile;