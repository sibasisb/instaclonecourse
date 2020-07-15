import React, { useEffect, useState, useContext } from 'react';
import '../App.css';
import { UserContext } from '../App';
import {useParams} from 'react-router-dom';




const UserProfile=()=>{
    const [profile,setProfile]=useState(null);
    const {userid}=useParams();
    const [showFollow,setShowFollow]=useState(state?!state.following.includes(userid):true);
    const {state,dispatch}=useContext(UserContext);
    useEffect(()=>{
        fetch("/profile/"+userid,{
            method:"GET",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(results=>{
            setProfile(results);
        })
        .catch(err=>console.log(err));
    },[]);

    const followUser=(id)=>{
        fetch('/profile/follow',{
            method:'PUT',
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({followedId:id})
        })
        .then(res=>res.json())
        .then(results=>{
            if(results.error){
                console.log(results.error);
            }
            dispatch({type:"UPDATE",payload:{followers:results.follower.followers,following:results.follower.following}});
            localStorage.setItem("user",JSON.stringify(results.follower));
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,results.follower._id]
                    }
                }
            });
            setShowFollow(false);
        })
        .catch(err=>console.log(err));
    }
    
    const unfollowUser=(id)=>{
        fetch('/profile/unfollow',{
            method:'PUT',
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({unfollowedId:id})
        })
        .then(res=>res.json())
        .then(results=>{
            dispatch({type:"UPDATE",payload:{followers:results.unfollower.followers,following:results.unfollower.following}});
            localStorage.setItem("user",JSON.stringify(results.unfollower));
            setProfile((prevState)=>{
                const newFollower=prevState.user.followers.filter(item=>item!==results.unfollower._id);
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            });
            setShowFollow(true);
        })
        .catch(err=>console.log(err));
    }

    return (
        <>
        {
        profile?
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={profile.user.pic}
                    />
                    
                </div>
                <div>
                    <h5>{profile?profile.user.name:"Loading"}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                        <h6> {profile.posts.length} Posts </h6>
                        <h6> {profile.user.followers.length} Followers </h6>
                        <h6> {profile.user.following.length} Following </h6>
                    </div>
                    {showFollow?
                        <button style={{margin:"10px"}} onClick={()=>followUser(userid)} className="btn waves-effect waves-light #42a5f5 blue darken-1">Follow</button>:
                        <button style={{margin:"10px"}} onClick={()=>unfollowUser(userid)} className="btn waves-effect waves-light #42a5f5 blue darken-1">Unfollow</button>
                    }
                </div>
            </div>
            <div className="gallery">
                {
                    profile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>            
                        )
                    })
                }
                
            </div>
        </div>:
        <h2>loading....!!!!</h2>
        }
        </>
    );
}

export default UserProfile;