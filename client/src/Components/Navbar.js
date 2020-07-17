import React,{useState,useContext,useRef, useEffect,useState} from 'react';
import '../App.css';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css';

const Navbar=()=>{
    const history=useHistory();
    const {state,dispatch}=useContext(UserContext);
    const [search,setSearch]=useState('');
    const searchModal=useRef(null);

    useEffect(()=>{
        M.Modal.init(searchModal.current);
    },[]);
    const renderList=()=>{

        if(state){
        return([
            <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
            <li key="2"><Link to="Profile">Profile</Link></li>,
            <li key="3"><Link to="Create">CreatePost</Link></li>,
            <li key="4"><Link to="followposts">My Following Posts </Link></li>,
            <li key="5">
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
            <li key="6"><Link to="Login">Login</Link></li>,
            <li key="7"><Link to="Signup">Signup</Link></li>
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

        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
            <div className="modal-content">
            <input type="text" placeholder="Search users" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat">Agree</button>
            </div>
        </div>
                  
        </nav>
        
    );
}

export default Navbar;