import React, { useEffect, useRef, useState } from "react";

export const VideoPlayer = ({ user }) => {
    const ref = useRef();
    const [audio, setAudio]=useState(true)
    const [video, setVideo] = useState(true);

    useEffect(() => {
        user.videoTrack.play(ref.current);
        user.audioTrack.play(ref.current)
    }, [user.videoTrack, user.audioTrack]);

    const toggleVideo=()=>{
        setVideo(!video);
        if (!video) {
            user.videoTrack.stop();
        } else {
            user.videoTrack.play(ref.current);
        }
    }

    const toggleAudio = () => {
        setAudio(!audio)
        if(!audio){
            user.audioTrack.stop();
        }else{
             user.audioTrack.play(ref.current);
        }
    };

    return (
        <>
            <div>
                Uid: {user.uid}
                <div
                    ref={ref}
                    style={{ width: "200px", height: "200px" }}
                ></div>
            </div>
            <div className="buttonContainer">
                <button onClick={toggleVideo}>toggle video</button>
                <button onClick={toggleAudio}>Toggle Audio</button>
            </div>
        </>
    );
};

export default VideoPlayer;
