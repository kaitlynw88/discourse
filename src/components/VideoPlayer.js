import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        user.videoTrack.play(ref.current);
        user.audioTrack.play(ref.current)
    }, [user.videoTrack, user.audioTrack]);

    const stopVideo=()=>{
        user.videoTrack.stop()
    }

    const stopAudio = () => {
        user.audioTrack.stop();
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
                <button onClick={stopVideo}>stop video</button>
                <button onClick={stopAudio}>stop Audio</button>
            </div>
        </>
    );
};

export default VideoPlayer;
