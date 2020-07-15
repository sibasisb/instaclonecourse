import React,{useState,useEffect, useContext} from 'react';
import '../App.css';
import { UserContext } from '../App';
import {Link} from 'react-router-dom';

const Home=()=>{
    const {state,dispatch}=useContext(UserContext);    
    const [data,setData]=useState([]);
    useEffect(()=>{
        
        fetch("/post/posts",{
            method:"GET",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(results=>{
            setData(results.posts);
        })
        .catch(err=>console.log(err));
    },[]);

    const likePost=(id)=>{
        fetch("/post/like",{
            method:"PUT",
            headers:{"authorization":"Bearer "+localStorage.getItem("jwt"),
            "Content-Type":"application/json"},
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id==result.result._id)
                    return result.result;
                return item;
            });
            setData(newData);
        })
        .catch(err=>console.log(err))
    }

    const unlikePost=(id)=>{
        fetch("/post/unlike",{
            method:"PUT",
            headers:{"authorization":"Bearer "+localStorage.getItem("jwt"),
            "Content-Type":"application/json"},
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id==result.result._id)
                    return result.result;
                return item;
            });
            setData(newData);
        })
        .catch(err=>console.log(err))
    }

    const commentPost=(text,postId)=>{
        fetch("/post/comment",{
            method:"PUT",
            headers:{"authorization":"Bearer "+localStorage.getItem("jwt"),
            "Content-Type":"application/json"},
            body:JSON.stringify({text:text,postId:postId})
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData=data.map(item=>{
                if(result.result._id==item._id)
                    return result.result;
                return item;
            });
            setData(newData);
        })
        .catch(err=>console.log(err));
    }

    const deletePost=(postId)=>{
        fetch('/post/deletePost/'+postId,{
            method:"DELETE",
            headers:{"authorization":"Bearer "+localStorage.getItem("jwt")}
        })
        .then(res=>res.json())
        .then(result=>{
            const newData=data.filter(item=>{
                return item._id!=result.post._id
            })
            setData(newData);
        })
        .catch(err=>console.log(err));
    }

    return (
        <div className="home">
        {
            data.map(item=>{
                return(
                    <div className="card home-card" key={item._id}>
                        <h5 style={{padding:"5px"}}><Link to={item.postedBy._id==state._id?'/Profile':'/Profile/'+item.postedBy._id}>{item.postedBy.name}</Link> {item.postedBy._id==state._id &&
                        <i className="material-icons" onClick={()=>deletePost(item._id)} 
                        style={{color:"red",float:"right"}}>delete</i> }</h5>
                        <div className="card-image">
                        <img src={item.photo} alt="No photo found"/>
                        </div>
                        <div className="card-content">
                            {
                                item.likes.includes(state._id)?
                                <i className="material-icons" onClick={()=>unlikePost(item._id)} style={{color:"red"}}>favorite</i>:
                                <i className="material-icons" onClick={()=>likePost(item._id)}>favorite</i>    
                            }
                            <h5>{item.likes.length} likes</h5>
                            <h5>{item.title}</h5>
                            <p>{item.body}</p>
                            {
                                item.comments.map(record=>{
                                    return(
                                    <h6 key={record._id}><span style={{fontWeight:"bold"}}>{record.commentedBy.name}</span>{record.text}</h6>
                                    );
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                commentPost(e.target[0].value,item._id);
                            }}>
                                <input type="text" placeholder="Add a comment"/>
                            </form>
                        </div>
                    </div>
                );
            })
        }
            
        </div>
    );
}

export default Home;