import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import VideoRoom from "./VideoRoom";
import { uid } from 'uid';
import UserProfile from "../components/UserProfile";

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
                <h2>Dashboard</h2>
                <div className="channels-section">
                    <div className="action-section">
                        {authUser ? (
                            <>
                                <h2>{`user name is ${authUser.email}`}</h2>

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
                                            to lobby
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
                                        {activeChannel ? (
                                            <button
                                                className="join-channel-button"
                                                onClick={() => setOnCall(true)}
                                            >
                                                {`Join ${activeChannel}`}{" "}
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                    </>
                                )}
                                <UserProfile userName={authUser.email} />

                                <button onClick={userSignOut}>Sign Out</button>
                            </>
                        ) : (
                            <button>
                                <Link to="/Login"> Login</Link>
                            </button>
                        )}
                    </div>

                    <ul className="channels-list-inner">
                        {channels.map((channel) => (
                            <li
                                key={channel}
                                onClick={() => setActiveChannel(channel)}
                                className={
                                    channel === activeChannel
                                        ? "active-channel"
                                        : "normal-channel"
                                }
                            >
                                {channel}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default HomePage;
