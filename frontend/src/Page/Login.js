import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Navigate ,Link, useNavigate} from "react-router-dom";
import {BACKEND_URL} from '../constant';

import "./Login.css";

function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const buttonRef = useRef();
  const userRef = useRef("");
  const passRef = useRef("");
  const bgRef = useRef();
  const navigate = useNavigate();

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  function updateBackground(e){
    // console.log(`linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,8,88,1) ${e.clientX/window.innerWidth}%, rgba(0,0,0,1) 100%);`)
    if(!!bgRef.current)
    bgRef.current.style.background = `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,8,88,1) ${(e.clientX/window.innerWidth)*100}%, rgba(0,0,0,1) 100%)`
  }

  useEffect(()=>{
    document.addEventListener("mousemove",updateBackground);
    return(()=>{
      document.removeEventListener("mousemove",updateBackground);
    })
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setIsSubmitted(true);

    if(userRef.current.value.length>0 && passRef.current.value.length>0){
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
       }
  
      let bodyContent = JSON.stringify({
        "username":userRef.current.value,
        "password":passRef.current.value
      });
      
      let response = await fetch(`${BACKEND_URL}/login`, { 
        method: "POST",
        body: bodyContent,
        headers: headersList
      });
      
      let data = await response.json();
      console.log(data)
      if("error" in data){
        setErrorMessages({ name: "uname", message: data.error });
        buttonRef.current.disabled=false;
      }else if("success" in data){
        // setIsSubmitted(true);
        localStorage.setItem("username", userRef.current.value);
        localStorage.setItem("password", passRef.current.value);
        localStorage.setItem("kanban", data.data);
        navigate("/board", {state: {data:data.data}});
      }
      
    }else{
      setErrorMessages({ name: "uname", message: "Please fill the details" });
      buttonRef.current.disabled=false;
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="form">
      {renderErrorMessage("uname")}
      <form onSubmit={(e)=>{buttonRef.current.disabled=true;setErrorMessages({ name: "uname", message: "" });handleSubmit(e);}}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required ref={userRef} />
          
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" ref={passRef} required />
          {/* {renderErrorMessage("pass")} */}
        </div>
        <div className="button-container">
          <input type="submit" ref={buttonRef}/>
        </div>
      </form>
    </div>
  );

  return (
    <div className="login-app" ref={bgRef}>
      <div className="login-form">
        <div className="title">Sign In</div>
        <div></div>
        <p>😀 😃 😄 😁 😆 🤩 😅 😂 🤣 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 🤪 😜 😝 😛 🤑 🤗 🤓 😎 🤡 🤠 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 😤 😠 😡 🤬 😶 😐 😑 😯 😦 😧 😮 😲 😵 🤯 😳 😱 😨 😰 😢 😥 🤤 😭 😓 😪 😴 🥱 🙄 🤨 🧐 🤔 🤫 🤭 🤥 😬 🤐 🤢 🤮 🤧 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹</p>
        {isSubmitted ? <Navigate to={"/board"} replace={true}/> : renderForm}
        New User!! <Link className="signup-text" to={"/signup"}>Create Account</Link><br/>
        <Link className="signup-text" to={"/users"}>See all Users</Link>
      </div>
    </div>
  );
}

export default Login;
