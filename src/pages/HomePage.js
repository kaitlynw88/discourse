import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import VideoRoom from "./VideoRoom";
import { uid } from 'uid';
import UserProfile from "../components/UserProfile";
import {db} from "../firebase";
import {collection, getDocs} from "firebase/firestore";
// import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
import "../styles/homepage.scss"


export const MOD = "MOD";
export const SPEAKER = "SPK";
export const LISTENER = "LST";
const HomePage = () => {
    const [authUser, setAuthUser] = useState(null);
    const [channels, setChannels] = useState([]);
    const [channelName, setChannelName] = useState("");
    const [activeChannel, setActiveChannel] = useState(null);
    const [onCall, setOnCall] = useState(false);
    const [token, setToken] = useState(null);
    const [profile, setProfile]=useState("");
    const [users, setUsers]=useState([])
    const usersCollectionRef=collection(db, "users")
    
    
    useEffect(()=>{
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getUsers();
        console.log(users);
        // eslint-disable-next-line
    },[]);


    useEffect(()=>{
        if (users.length > 0 && profile === "") {
            const myUser = users.filter(
                (elem) => elem.email === authUser.email
            );
            setProfile(myUser[0]);
        }
        // eslint-disable-next-line
    },[users]);


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

    // Form related functions
    const generateToken = async (channelName) => {
        // https://discourse-token-server.up.railway.app/access_token?channelName=test&role=subscriber&uid=1234&expireTime=6400
        let id = uid(10);
        console.log("uid", id);
        const response = await fetch(`https://discourse-token-server.up.railway.app/access_token?channelName=${channelName}`
        );
        const data = await response.json();
        console.log('data', data)
        return data.token;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChannels([...channels, channelName]);
        let token = await generateToken(channelName);
        setToken(token);
        // createChannel(channelName);

        // Add the channel to firestore
        // await addChannelToFirestore(channelName);
        // Update the UI to show the new channel in a list of available channels
        setChannelName("");
    }

    const handleChange = (e) => {
        setChannelName(e.target.value);
    }


    return (
        <>
            <div>
                <div className="channels-section">
                    <div className="action-section">
                        {authUser ? (
                            <>
                                <UserProfile userEmail={authUser.email} profile={profile} />

                                <h2>chat rooms</h2>

                                {onCall ? (
                                    <>
                                        <VideoRoom
                                            userName={authUser.email}
                                            TOKEN={token}
                                            CHANNEL={activeChannel}
                                        />
                                        <button
                                            onClick={() => setOnCall(false)}
                                        >
                                            leave
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                type="text"
                                                placeholder="Enter channel name"
                                                value={channelName}
                                                onChange={handleChange}
                                            />
                                            <button type="submit">
                                                Create Channel
                                            </button>
                                        </form>

                                        <ul className="channels-list-inner">
                                            {channels.map((channel) => (
                                                <li
                                                    key={channel}
                                                    onClick={() =>
                                                        setActiveChannel(
                                                            channel
                                                        )
                                                    }
                                                    className={
                                                        channel ===
                                                        activeChannel
                                                            ? "active-channel"
                                                            : "normal-channel"
                                                    }
                                                >
                                                    <h3>{channel}</h3>
                                                    {activeChannel ? (
                                                        <button
                                                            className="join-channel-button"
                                                            onClick={() =>
                                                                setOnCall(true)
                                                            }
                                                        >
                                                            {`Join ${activeChannel}`}{" "}
                                                        </button>
                                                    ) : (
                                                        ""
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <button onClick={userSignOut}>Sign Out</button>
                            </>
                        ) : (
                            <button>
                                <Link to="/Login"> Login</Link>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
