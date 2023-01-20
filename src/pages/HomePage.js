import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import VideoRoom from "./VideoRoom";


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
            <div>
                <p>This will send us to the room!</p>
                <h2>Dashboard</h2>
                {authUser ? (
                    <>
                    <h2>{`user name is ${authUser.email}`}</h2>
                    <button onClick={userSignOut}>Sign Out</button>



                    {!joined && (
                        <button onClick={()=> setJoined(true)}>
                            Join this room
                        </button>
                    )}
                    {joined && (
                        <VideoRoom userName={authUser.email}/>
                    )

                    }





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
