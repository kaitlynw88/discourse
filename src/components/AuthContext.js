import { onAuthStateChanged, signOut } from "firebase/auth";
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";




const AuthContext =()=>{
    const [authUser, setAuthUser] =useState(null)

    useEffect(()=>{
        const listen = onAuthStateChanged(auth, (user)=>{
            if(user){
                setAuthUser(user)
            }else{
                setAuthUser(null)
            }
           
        })
        return()=>{
            listen()
        }
    },[authUser])

    const userSignOut = () => {
        signOut(auth);
    };


    return (
        <>
            <div>
                {authUser ? (
                    <>
                      <h2>{`user name is ${authUser.email}`}</h2>
                      <button onClick={userSignOut}>Sign Out</button>
                    </>
                ) : (
                    <button>
                        <Link to="/Login"> Login</Link>
                    </button>
                )}
            </div>
        </>
    );
}

export default AuthContext