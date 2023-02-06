//code from Tutorial from Web Dev Cody.
import ChatContainer from "../components/ChatContainer.js";
import AgoraRTC, { createClient } from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import "../styles/videoRoom.scss"

const APP_ID = "c09cde14905f4906951bfbc5deebf2b8";

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({
    onVideoTrack,
    onUserDisconnected,
    APP_ID,
    CHANNEL,
    TOKEN,
}) => {
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
                if (mediaType === "audio") {
                    user.audioTrack.play();
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

const VideoRoom = ({ CHANNEL, TOKEN, userName }) => {
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
            APP_ID,
            CHANNEL,
            TOKEN,
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

        
        agoraCommandQueue = agoraCommandQueue.then(setup);

        return () => {
            agoraCommandQueue = agoraCommandQueue.then(cleanup);
        };
    }, [CHANNEL, TOKEN]);

    return (
        <div className="videoContainer">
           
           {uid}
            <div>
                <div className="userContainer">
                    {users.map((user) => (
                        <>
                            <VideoPlayer key={user.uid} user={user} />
                        </>
                    ))}
                </div>
            </div>
            <ChatContainer userName={userName} channel={CHANNEL} />
        </div>
    );
};

export default VideoRoom;
