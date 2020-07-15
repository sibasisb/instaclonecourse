import React,{useState,useContext} from 'react';
import '../App.css';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'

const Navbar=()=>{
    const history=useHistory();
    const {state,dispatch}=useContext(UserContext);
    const renderList=()=>{
        
        if(state){
        return([
            <li><Link to="Profile">Profile</Link></li>,
            <li><Link to="Create">CreatePost</Link></li>,
            <li><Link to="followposts">My Following Posts </Link></li>,
            <li>
                <button onClick={()=>{
                    localStorage.clear();
                    dispatch({type:"CLEAR"});
                    history.push('/Login');
                }} className="btn waves-effect waves-light #42a5f5 blue darken-1">Logout</button>
            </li>
        ])
    }
    else{
        return([
            <li><Link to="Login">Login</Link></li>,
            <li><Link to="Signup">Signup</Link></li>
        ])
    }
    }
    return(
        <nav>
        <div className="nav-wrapper white">
            <Link to={state?"/":"/Login"} className="brand-logo left">Instaclone</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
        </div>
        </nav>
        
    );
}

export default Navbar;