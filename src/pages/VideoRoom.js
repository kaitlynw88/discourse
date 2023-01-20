import "../styles/videoRoom.scss";
import { Link } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
//  
import AudioPlayer from "../components/AudioPlayer";
const APP_ID = "c09cde14905f4906951bfbc5deebf2b8";
const TOKEN =
    "007eJxTYNDiXPdj6rLfUf/+aV1S6r7DqTOxj23lus3ML7a90t9npzNNgSHZwDI5JdXQxNLANA1ImFmaGialJSWbpqSmJqUZJVm8+X0quSGQkeGO20xWRgYIBPE5GVIyi5PzS4uKUxkYAKrfJLQ=";
const CHANNEL = "discourse"

const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8"
}) 
 

const VideoRoom =()=>{
    const [users, setUsers]=useState([])
    const handleUserJoined=async(user, mediaType)=>{
        await client.subscribe(user, mediaType);
        
        if (mediaType === "video") {
            setUsers((previousUsers)=> [...previousUsers, user])
        }

        if(mediaType === "audio"){
            // user.audioTrack.play()
        }

    }

    const handleUserLeft =(user)=>{
        setUsers((previousUsers)=>
        previousUsers.filter((u) => u.uid !== user.uid))
    }

    useEffect(()=>{
        client.on("user-published", handleUserJoined)
        client.on("user-left", handleUserLeft);

        client.join(APP_ID, CHANNEL, TOKEN, null)
        .then((uid)=>
            Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(),uid])
        ).then(([tracks, uid]) =>{
            const [audioTrack, videoTrack]=tracks;
            setUsers((previousUsers)=> [...previousUsers, {
                uid,
                videoTrack,
                audioTrack 
            }])
            client.publish(tracks)
        })
    },[])
    
    return (
        <>
            <h1>This is the video room</h1>
            <div className="roomContainer">
                
                <ul className="chatLog">
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
                </ul>

                {users.map((user)=>{
                    return(
                        <div>
                                {user.uid}
                            <AudioPlayer key={user.uid} user={user}>
                            </AudioPlayer>
                        </div>

                    )
                })}
                
            </div>
            <button>
                <Link to="/">back to dashboard</Link>
            </button>
        </>
    );
}

export default VideoRoom
