
import { signOut } from "firebase/auth";
import { React, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthDetails =()=>{
    const [authUser, setAuthUser]=useState(null)
    useEffect(()=>{
        auth.onAuthStateChanged((user) => {
            setAuthUser(user)
        })
    },[])

    const userSignOut =()=>{ 
        signOut(auth).then(()=>{
            console.log("you signed out") 
        }).catch(error =>console.log(error))
    }
    return(
        <div>
            {authUser 
            ? 
            <>
                <p>{`You are signed as ${authUser.email} `}</p> 
                <button onClick={userSignOut}>Sign out</button>
            </>
            : 
            <p>You are not signed in</p>}
        </div>
    )
}

export default AuthDetails