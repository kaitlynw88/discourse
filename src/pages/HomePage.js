import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import VideoRoom from "./VideoRoom";
import "../styles/homepage.scss"


export const MOD = "MOD";
export const SPEAKER = "SPK";
export const LISTENER = "LST";
const HomePage = () => {
    const [authUser, setAuthUser] = useState(null);

  

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return () => {
            listen();
        };
    }, [authUser]);

    const userSignOut = () => {
        signOut(auth);
    };

    const[joined, setJoined]=useState(false)

    
    return (
        <>
            <div className="flexContainer">
               
                {authUser ? (
                    <>
                    <h2>{`Welcome ${authUser.email}!!!`}</h2>
                    <p>This is your dashboard</p>

                    {!joined && (
                        <button onClick={()=> setJoined(true)}>
                            Join the topic of the day
                        </button>
                    )}
                    {joined && (
                        <>
                        <VideoRoom userName={authUser.email}/>
                        <button onClick={()=>setJoined(false)}>to lobby</button>
                        </>
                        )
                        
                    }
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
};

export default HomePage;
