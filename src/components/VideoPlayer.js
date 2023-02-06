import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneLines,faMicrophoneLinesSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons"
import "../styles/videoplayer.scss"

export const VideoPlayer = ({ user }) => {
    const ref = useRef();
    const [audio, setAudio]=useState(false)
    const [video, setVideo] = useState(false);

    useEffect(() => {
        user.videoTrack.play(ref.current);
        user.audioTrack.play(ref.current)
    }, [user.videoTrack, user.audioTrack]);

    const toggleVideo=()=>{
        setVideo(!video);
        if (!video) {
            user.videoTrack.stop(ref.current);
        } else {
            user.videoTrack.play(ref.current);
        }
    }

    const toggleAudio = () => {
        setAudio(!audio)
        if(!audio){
            user.audioTrack.stop(ref.current);
        }else{
             user.audioTrack.play(ref.current);
        }
    };

    return (
        <>
            <div className="videoBox">
                <div className="usersVideo" ref={ref}>
            
                </div>
                <div className="buttonContainer">
                    <button onClick={toggleVideo}>
                        {video === true ? (
                            <>
                                <FontAwesomeIcon
                                    icon={faVideo}
                                    className="fa-fw videoTrue"
                                />
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={faVideoSlash}
                                    className="fa-fw videoFalse"
                                />
                            </>
                        )}
                    </button>
                    <button onClick={toggleAudio}>
                        {audio === true ? (
                            <>
                                <FontAwesomeIcon
                                    icon={faMicrophoneLines}
                                    className="fa-fw audioTrue"
                                />
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={faMicrophoneLinesSlash}
                                    className="fa-fw audioFalse"
                                />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default VideoPlayer;
