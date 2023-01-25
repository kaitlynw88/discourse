import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneLines,faMicrophoneLinesSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons"

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
            <div>
                Uid: {user.uid}
                <div
                    ref={ref}
                    style={{ width: "200px", height: "200px" }}
                ></div>
            </div>
            <div className="buttonContainer">
                <button onClick={toggleVideo}>
                    {(video=== true ?
                    <>
                        <FontAwesomeIcon icon={faVideo} className="fa-fw" />
                    </>
                    :
                    <>
                        <FontAwesomeIcon icon={faVideoSlash} className="fa-fw" />
                    </>
                    ) 
                    }
                </button>
                <button onClick={toggleAudio}>
                    {
                        (audio=== true) ?
                        <>
                            <FontAwesomeIcon icon={faMicrophoneLines} className="fa-fw" />
                        </>
                        :
                        <>
                            <FontAwesomeIcon icon={faMicrophoneLinesSlash} className="fa-fw" />
                        </>
                    }
                </button>
            </div>
        </>
    );
};

export default VideoPlayer;
