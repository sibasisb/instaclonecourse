import React,{useState,useContext} from 'react';
import {UserContext} from '../App';
import '../App.css';
import {Link,useHistory} from 'react-router-dom';
import M, { FloatingActionButton } from 'materialize-css';

const Login=()=>{
    const {state,dispatch}=useContext(UserContext);
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const history=useHistory();
    const PostSign=()=>{
        fetch("/auth/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"})
            }
            else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                M.toast({html: "Logged in successfully",classes:"#43a047 green darken-1"});
                history.push('/');
            }
        })
    }

    return (
        <div className="mycard">
        <div className="card myauth input-field">
            <h2>Instaclone</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={()=>PostSign()} className="btn waves-effect waves-light #42a5f5 blue darken-1">Login</button><br/>
            <h5><Link to="Signup">Don't have an account?</Link></h5>
        </div>
        </div>
    );
}

export default Login;
