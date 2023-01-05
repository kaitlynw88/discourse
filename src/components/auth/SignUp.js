import React from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase";


const SignUp =()=>{
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");

    const schools=["uoftoronto.com", "uofguelph.ca"]

    const handleSignUp =(e)=>{
        e.preventDefault();

        let emailCheck = email
        let index = emailCheck.indexOf("@");
        let checkDomain = emailCheck.substring(index + 1)
        
        schools.forEach((school)=>{
            if(school === checkDomain){
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredetial)=>{
                    console.log(userCredetial)
                }).catch((error)=>{
                    console.log(error)
                })
            }
        })
    }
    return (
        <div>
            <h1>Create an Account</h1>

            <form onSubmit={handleSignUp}>  
                <p>please make sure to use a valid university or college email</p>
                <input 
                type="email" 
                placeholder="enter your email" 
                value={email} 
                onChange={(e) =>setEmail(e.target.value)}/>
                <input 
                type="password" 
                placeholder="enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Sign Up here</button>
            </form>
        </div>
    );
}

export default SignUp