import React,{useReducer,createContext,useState, useEffect,useContext} from 'react';
import Navbar from './Components/Navbar';
import './App.css';
import {BrowserRouter,Route, Switch,useHistory} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import CreatePost from './Components/CreatePost';
import UserProfile from './Components/UserProfile';
import SubscribedUserPosts from './Components/SubscribedPosts';
import {initialState,reducer} from './Reducers/userReducer';

export const UserContext=createContext()

const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user});
    }
    else{
      history.push('/Login');
    }
  },[])

  return(
  <Switch>
  <Route exact path='/'><Home/></Route>
  <Route path='/Login'><Login/></Route>
  <Route path='/Signup'><Signup/></Route>
  <Route exact path='/Profile'><Profile/></Route>
  <Route path='/Create'><CreatePost/></Route>
  <Route path='/Profile/:userid'><UserProfile/></Route>
  <Route path='/followposts'><SubscribedUserPosts/></Route>
  </Switch>
)};


function App(){
  const [state,dispatch]=useReducer(reducer,initialState);

  return(
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;