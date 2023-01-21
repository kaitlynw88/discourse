import "../styles/videoRoom.scss";
import AgoraRTC, {createClient} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
//  
import AudioPlayer from "../components/AudioPlayer";
const APP_ID = "c09cde14905f4906951bfbc5deebf2b8";
const TOKEN =
    "007eJxTYOjTz12bwuzd1Jkj9OBZwtNJhRzirqtqnqiGL5BKPSjHulaBIdnAMjkl1dDE0sA0DUiYWZoaJqUlJZumpKYmpRklWcwMPpPcEMjI4LxLhoERCkF8ToaUzOLk/NKi4lQGBgBmnCAI";

    // we will have to generate these tokens somehow
const CHANNEL = "discourse"

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

   

const VideoRoom =(props)=>{
    const [users, setUsers]=useState([])
    const [uid, setUid]=useState(null)

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
            <h1>This is the video room</h1>
            <p>chat with you friends about the "topic of the day"</p>
            <div className="roomContainer">
                {/* <ul className="chatLog">
                    <h3>Chat log</h3>
                    <li>
                        <p>username1</p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Sequi, excepturi.
                        </p>
                        <p>date stamp1</p>
                    </li>
                    <li>
                        <p>username2</p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Magnam, quae?
                        </p>
                        <p>date stamp2</p>
                    </li>
                    <li>
                        <p>username3</p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Vitae, alias.
                        </p>
                        <p>datestamp3</p>
                    </li>
                </ul> */}
                <div className="videoPlayerContainer">
                    {users.map((user) => {
                        return (
                            <div className="userContainer">
                                <p>{uid}</p>
                                <AudioPlayer key={user.uid} user={user} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* <button>
                <Link to="/">back to dashboard</Link>
            </button> */}
        </>
    );
}

export default VideoRoom
