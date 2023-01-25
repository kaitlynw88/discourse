import React, { useEffect, useState } from "react";
import AgoraRTC, { createClient } from "agora-rtc-sdk-ng";
import VideoPlayer from "../components/VideoPlayer.js";

import ChatContainer from "../components/ChatContainer.js";

const APP_ID = "99ee7677a8a745ed94b7f7f03fdab53e";
const TOKEN =
    "007eJxTYGB7KNMQzvx+7sEOvZol8c8VVb+xLz7ku3fD9Gs5FpdXG1YrMCQbWCanpBqaWBqYpgEJM0tTw6S0pGTTlNTUpDSjJIuv7heSGwIZGapZZjAzMkAgiM/JkJJZnJxfWlScysAAAB9kIoY=";
const CHANNEL = "discourse";

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({ onVideoTrack, onUserDisconnected }) => {
    const client = createClient({
        mode: "rtc",
        codec: "vp8",
    });

    let tracks;
    

    const waitForConnectionState = (connectionState) => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (client.connectionState === connectionState) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    };

    const connect = async () => {
        await waitForConnectionState("DISCONNECTED");

        const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);

        client.on("user-published", (user, mediaType) => {
            client.subscribe(user, mediaType).then(() => {
                if (mediaType === "video") {
                    onVideoTrack(user);
                }
            });
        });

        client.on("user-left", (user) => {
            onUserDisconnected(user);
        });

        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        await client.publish(tracks);

        return {
            tracks,
            uid,
        };
    };

    const disconnect = async () => {
        await waitForConnectionState("CONNECTED");
        client.removeAllListeners();
        for (let track of tracks) {
            track.stop();
            track.close();
        }
        await client.unpublish(tracks);
        await client.leave();
    };

    return {
        disconnect,
        connect,
    };
};

const VideoRoom = (props) => {
    const [users, setUsers] = useState([]);
    const [uid, setUid] = useState(null);
    

    useEffect(() => {
        const onVideoTrack = (user) => {
            setUsers((previousUsers) => [...previousUsers, user]);
        };

        const onUserDisconnected = (user) => {
            setUsers((previousUsers) =>
                previousUsers.filter((u) => u.uid !== user.uid)
            );
        };

        const { connect, disconnect } = createAgoraClient({
            onVideoTrack,
            onUserDisconnected,
        });

        const setup = async () => {
            const { tracks, uid } = await connect();
            setUid(uid);
            setUsers((previousUsers) => [
                ...previousUsers,
                {
                    uid,
                    audioTrack: tracks[0],
                    videoTrack: tracks[1],
                },
            ]);
        };

        const cleanup = async () => {
            await disconnect();
            setUid(null);
            setUsers([]);
        };

        // setup();
        agoraCommandQueue = agoraCommandQueue.then(setup);

        return () => {
            // cleanup();
            agoraCommandQueue = agoraCommandQueue.then(cleanup);
        };
    }, []);

    return (
        <>
            {uid}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 200px)",
                    }}
                >
                    {users.map((user) => (
                        <>
                            <VideoPlayer key={user.uid} user={user} />
                        </>
                    ))}
                </div>
            </div>
            <ChatContainer userName={props.userName} />
        </>
    );
};

export default VideoRoom;
