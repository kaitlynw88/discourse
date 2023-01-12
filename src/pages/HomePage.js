import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

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

    return (
        <>
            <div>
                <h2>Dashboard</h2>
                {authUser ? (
                    <>
                        <h2>{`user name is ${authUser.email}`}</h2>
                        <button onClick={userSignOut}>Sign Out</button>
                        <ul>
                            <li>
                                <Link to="/videoroom">Chat Room 1</Link>
                            </li>
                            <li>
                                <Link to="/videoroom">Chat Room 2</Link>
                            </li>
                            <li>
                                <Link to="/videoroom">Chat Room 3</Link>
                            </li>
                        </ul>
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
