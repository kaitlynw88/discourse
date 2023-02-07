import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import VideoRoom from "./VideoRoom";
import { uid } from "uid";
import UserProfile from "../components/UserProfile";
import { db, RealtimeDatabase } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
// import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
import "../styles/homepage.scss";
import { onValue, ref, set, remove } from "firebase/database";

import logo from "../assets/discourse.svg";

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
    const [profile, setProfile] = useState("");
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [eventTime, setEventTime] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getUsers();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        onValue(ref(RealtimeDatabase, "channels"), (snapshot) => {
            const data = snapshot.val();
            const channels = [];

            for (let id in data) {
                channels.push({ ...data[id] });
            }
            console.log("remote data", channels);
            setChannels(channels);
        });
    }, []);

    useEffect(() => {
        if (users.length > 0 && authUser && profile === "") {
            const myUser = users.filter(
                (elem) => elem.email === authUser.email
            );
            setProfile(myUser[0]);
        }
        // eslint-disable-next-line
    }, [users]);
    if (authUser) {
        console.log(authUser.email);
    }

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
        // https://discourse-token-server.up.railway.app/access_token?channelName=test&role=subscriber&uid=1234&expireTime=86400'
        // eslint-disable-next-line
        let id = uid(10);
        const response = await fetch(
            `https://discourse-token-server.up.railway.app/access_token?channelName=${channelName}&expireTime=86400`
        );
        const data = await response.json();
        return data.token;
    };

    const addChannelToRealtimeDB = async (
        channelName,
        eventTime,
        userEmail = null
    ) => {
        try {
            const channelRef = ref(RealtimeDatabase, "channels/" + channelName);
            await set(channelRef, {
                channelName: channelName,
                createdAt: Date.now(),
                eventTime: eventTime,
                userEmail: userEmail,
            });
        } catch (error) {
            console.log("Error Posting:", error);
        }
    };

    const deleteChannelFromRealtimeDB = async (channelName) => {
        try {
            const channelRef = ref(RealtimeDatabase, "channels/" + channelName);
            await remove(channelRef);
        } catch (error) {
            console.log("Error Deleting:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // eslint-disable-next-line
        let token = await generateToken(channelName);

        let createdAt = Date.now();
        let userEmail = authUser.email;
        setChannels([
            ...channels,
            {
                channelName: channelName,
                createdAt: createdAt,
                eventTime: eventTime,
                userEmail: userEmail,
            },
        ]);

        addChannelToRealtimeDB(channelName, eventTime, authUser.email);

        setChannelName("");
    };

    const timeConverter = (datetime_local) => {
        // This function convert the datetime_local to timestamp
        var timestamp = new Date(datetime_local).getTime();
        return timestamp;
    };

    const handleChange = (e) => {
        if (e.target.id === "channelName") {
            setChannelName(e.target.value);
        }
        if (e.target.id === "eventTime") {
            setEventTime(e.target.value);
        }
    };

    useEffect(() => {
        // This function delete the channel from the realtime database if the event time is passed of one hour
        // To make sure we don't delete the channel before the event time we add 3600 seconds to the event time
        if (channels.length > 0) {
            channels.forEach((channel) => {
                let now = Date.now();
                let eventTime = timeConverter(channel.eventTime) + 3600;
                if (eventTime < now) {
                    deleteChannelFromRealtimeDB(channel.channelName);
                    setChannels(
                        channels.filter(
                            (elem) => elem.channelName !== channel.channelName
                        )
                    );
                }
            });
        }
    }, [channels]);

    return (
        <>
            <div>
                <div className="channels-section">
                    <div className="action-section">
                        {authUser ? (
                            <>
                                <UserProfile
                                    userEmail={authUser.email}
                                    profile={profile}
                                />

                                <h2>chat rooms</h2>

                                {onCall ? (
                                    <>
                                        <VideoRoom
                                            userName={authUser.email}
                                            TOKEN={token}
                                            CHANNEL={activeChannel.channelName}
                                        />
                                        <button
                                            className="leave"
                                            onClick={() => setOnCall(false)}
                                        >
                                            leave
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <form
                                            className="channelCreate"
                                            onSubmit={handleSubmit}
                                        >
                                            <input
                                                type="text"
                                                id="channelName"
                                                placeholder="Enter channel name"
                                                value={channelName}
                                                onChange={handleChange}
                                            />
                                            <label>Event Time</label>
                                            <input
                                                type="datetime-local"
                                                value={eventTime}
                                                id="eventTime"
                                                onChange={handleChange}
                                            />
                                            <button type="submit">
                                                Create Channel
                                            </button>
                                        </form>

                                        <ul className="channels-list-inner">
                                            {channels.map((channel) => (
                                                <li
                                                    key={channel.name}
                                                    onClick={async () => {
                                                        setToken(
                                                            await generateToken(
                                                                channel.channelName
                                                            )
                                                        );

                                                        setActiveChannel(
                                                            channel
                                                        );
                                                        console.log(
                                                            "current token:" +
                                                                token,
                                                            "currentChannel:" +
                                                                channel.channelName
                                                        );
                                                    }}
                                                    className={
                                                        channel ===
                                                        activeChannel
                                                            ? "active-channel"
                                                            : "normal-channel"
                                                    }
                                                >
                                                    <h3>
                                                        {channel.channelName}
                                                    </h3>
                                                    <p>
                                                        Date:{" "}
                                                        {channel.eventTime}
                                                    </p>

                                                    <div className="opacityLayer">
                                                        {activeChannel &&
                                                        activeChannel.channelName ===
                                                            channel.channelName ? (
                                                            <>
                                                                <button
                                                                    className="join-channel-button"
                                                                    onClick={() =>
                                                                        setOnCall(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    {`Join ${activeChannel.channelName}`}
                                                                </button>
                                                                {
                                                                    // this button is only visible to the user who created the channel
                                                                    authUser.email ===
                                                                    channel.userEmail ? (
                                                                        <button
                                                                            onClick={() => {
                                                                                deleteChannelFromRealtimeDB(
                                                                                    channel.channelName
                                                                                );
                                                                                setChannels(
                                                                                    channels.filter(
                                                                                        (
                                                                                            elem
                                                                                        ) =>
                                                                                            elem.channelName !==
                                                                                            channel.channelName
                                                                                    )
                                                                                );
                                                                                setActiveChannel(
                                                                                    null
                                                                                );
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    ) : (
                                                                        ""
                                                                    )
                                                                }
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <button
                                    className="signout"
                                    onClick={userSignOut}
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="homeLogin">
                                <img
                                    className="logo"
                                    src={logo}
                                    alt="discourse logo"
                                />
                                <button className="authButton">
                                    <Link to="/Login"> Login</Link>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

// import { onAuthStateChanged, signOut } from "firebase/auth";
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { auth } from "../firebase";
// import VideoRoom from "./VideoRoom";
// import { uid } from "uid";
// import UserProfile from "../components/UserProfile";
// import { db, RealtimeDatabase } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// // import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";
// import "../styles/homepage.scss";
// import { onValue, ref, set, remove } from "firebase/database";

// import logo from "../assets/discourse.svg";

// export const MOD = "MOD";
// export const SPEAKER = "SPK";
// export const LISTENER = "LST";
// const HomePage = () => {
//   const [authUser, setAuthUser] = useState(null);
//   const [channels, setChannels] = useState([]);
//   const [channelName, setChannelName] = useState("");
//   const [activeChannel, setActiveChannel] = useState(null);
//   const [onCall, setOnCall] = useState(false);
//   const [token, setToken] = useState(null);
//   const [profile, setProfile] = useState("");
//   const [users, setUsers] = useState([]);
//   const usersCollectionRef = collection(db, "users");
//   const [eventTime, setEventTime] = useState(null);

//   useEffect(() => {
//     const getUsers = async () => {
//       const data = await getDocs(usersCollectionRef);
//       setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//     };
//     getUsers();
//     // eslint-disable-next-line
//   }, []);

//   useEffect(() => {
//     onValue(ref(RealtimeDatabase, "channels"), (snapshot) => {
//       const data = snapshot.val();
//       const channels = [];

//       for (let id in data) {
//         channels.push({ ...data[id] });
//       }
//       console.log("remote data", channels);
//       setChannels(channels);
//     });
//   }, []);

//   useEffect(() => {
//     if (users.length > 0 && authUser && profile === "") {
//       const myUser = users.filter((elem) => elem.email === authUser.email);
//       setProfile(myUser[0]);
//     }
//     // eslint-disable-next-line
//   }, [users]);
//   if (authUser) {
//     console.log(authUser.email);
//   }

//   useEffect(() => {
//     const listen = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setAuthUser(user);
//       } else {
//         setAuthUser(null);
//       }
//     });

//     return () => {
//       listen();
//     };
//   }, [authUser]);

//   const userSignOut = () => {
//     signOut(auth);
//   };

//   // Form related functions
//   const generateToken = async (channelName) => {
//     // https://discourse-token-server.up.railway.app/access_token?channelName=test&role=subscriber&uid=1234&expireTime=86400
//     let id = uid(10);
//     const response = await fetch(
//       `https://discourse-token-server.up.railway.app/access_token?channelName=${channelName}&expireTime=86400`
//     );
//     const data = await response.json();
//     return data.token;
//   };

//   const addChannelToRealtimeDB = async (
//     channelName,
//     eventTime,
//     userEmail = null
//   ) => {
//     try {
//       const channelRef = ref(RealtimeDatabase, "channels/" + channelName);
//       await set(channelRef, {
//         channelName: channelName,
//         createdAt: Date.now(),
//         eventTime: eventTime,
//         userEmail: userEmail,
//       });
//     } catch (error) {
//       console.log("Error Posting:", error);
//     }
//   };

//   const deleteChannelFromRealtimeDB = async (channelName) => {
//     try {
//       const channelRef = ref(RealtimeDatabase, "channels/" + channelName);
//       await remove(channelRef);
//     } catch (error) {
//       console.log("Error Deleting:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let token = await generateToken(channelName);

//     let createdAt = Date.now();
//     let userEmail = authUser.email;
//     setChannels([
//       ...channels,
//       {
//         channelName: channelName,
//         createdAt: createdAt,
//         eventTime: eventTime,
//         userEmail: userEmail,
//       },
//     ]);

//     addChannelToRealtimeDB(channelName, eventTime, authUser.email);

//     setChannelName("");
//   };

//   const timeConverter = (datetime_local) => {
//     // This function convert the datetime_local to timestamp
//     var timestamp = new Date(datetime_local).getTime();
//     return timestamp;
//   };

//   const handleChange = (e) => {
//     if (e.target.id === "channelName") {
//       setChannelName(e.target.value);
//     }
//     if (e.target.id === "eventTime") {
//       setEventTime(e.target.value);
//     }
//   };

//   useEffect(() => {
//     // This function delete the channel from the realtime database if the event time is passed of one hour
//     // To make sure we don't delete the channel before the event time we add 3600 seconds to the event time
//     if (channels.length > 0) {
//       channels.forEach((channel) => {
//         let now = Date.now();
//         let eventTime = timeConverter(channel.eventTime) + 3600;
//         if (eventTime < now) {
//           deleteChannelFromRealtimeDB(channel.channelName);
//           setChannels(
//             channels.filter((elem) => elem.channelName !== channel.channelName)
//           );
//         }
//       });
//     }
//   }, [channels]);

//   return (
//     <>
//       <div>
//         <div className="channels-section">
//           <div className="action-section">
//             {authUser ? (
//               <>
//                 <UserProfile userEmail={authUser.email} profile={profile} />

//                 <h2>chat rooms</h2>

//                 {onCall ? (
//                   <>
//                     <VideoRoom
//                       userName={authUser.email}
//                       TOKEN={token}
//                       CHANNEL={activeChannel.channelName}
//                     />
//                     <button className="leave" onClick={() => setOnCall(false)}>
//                       leave
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <form className="channelCreate" onSubmit={handleSubmit}>
//                       <input
//                         type="text"
//                         id="channelName"
//                         placeholder="Enter channel name"
//                         value={channelName}
//                         onChange={handleChange}
//                       />
//                       <label>Event Time</label>
//                       <input
//                         type="datetime-local"
//                         value={eventTime}
//                         id="eventTime"
//                         onChange={handleChange}
//                       />
//                       <button type="submit">Create Channel</button>
//                     </form>

//                     <ul className="channels-list-inner">
//                       {channels.map((channel) => (
//                         <li
//                           key={channel.name}
//                           onClick={async () => {
//                             setToken(await generateToken(channel.channelName));

//                             setActiveChannel(channel);
//                             console.log(
//                               "current token:" + token,
//                               "currentChannel:" + channel.channelName
//                             );
//                           }}
//                           className={
//                             channel === activeChannel
//                               ? "active-channel"
//                               : "normal-channel"
//                           }
//                         >
//                           <h3>{channel.channelName}</h3>
//                           <p>Date: {channel.eventTime}</p>

//                           <div className="opacityLayer">
//                             {activeChannel &&
//                             activeChannel.channelName ===
//                               channel.channelName ? (
//                               <>
//                                 <button
//                                   className="join-channel-button"
//                                   onClick={() => setOnCall(true)}
//                                 >
//                                   {`Join ${activeChannel.channelName}`}
//                                 </button>
//                                 {
//                                   // this button is only visible to the user who created the channel
//                                   authUser.email === channel.userEmail ? (
//                                     <button
//                                       onClick={() => {
//                                         deleteChannelFromRealtimeDB(
//                                           channel.channelName
//                                         );
//                                         setChannels(
//                                           channels.filter(
//                                             (elem) =>
//                                               elem.channelName !==
//                                               channel.channelName
//                                           )
//                                         );
//                                         setActiveChannel(null);
//                                       }}
//                                     >
//                                       Delete
//                                     </button>
//                                   ) : (
//                                     ""
//                                   )
//                                 }
//                               </>
//                             ) : (
//                               ""
//                             )}
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </>
//                 )}

//                 <button className="signout" onClick={userSignOut}>
//                   Sign out
//                 </button>
//               </>
//             ) : (
//               <div className="homeLogin">
//                 <img className="logo" src={logo} alt="discourse logo" />
//                 <button className="authButton">
//                   <Link to="/Login"> Login</Link>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HomePage;
