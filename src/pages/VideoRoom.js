import "../styles/videoRoom.scss";
import { Link } from "react-router-dom";

const VideoRoom =()=>{

    
    return (
        <>
            <h1>This is the video room</h1>
            <div className="roomContainer">
                <ul className="videoList">
                    <li>
                        <p>Video Contaier 1</p>
                        <p>username1</p>
                    </li>
                    <li>
                        <p>Video container 2</p>
                        <p>username2</p>
                    </li>
                    <li>
                        <p>Video container 3</p>
                        <p>username3</p>
                    </li>
                </ul>

                <ul className="chatLog">
                    <h3>Chat log</h3>
                    <li>
                        <p>username1</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, excepturi.</p>
                        <p>date stamp1</p>
                    </li>
                    <li>
                        <p>username2</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, quae?</p>
                        <p>date stamp2</p>
                    </li>
                    <li>
                        <p>username3</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, alias.</p>
                        <p>datestamp3</p>
                    </li>
                </ul>

            </div>
            <button>
                <Link to="/">back to dashboard</Link>
            </button>
        </>
    );
}

export default VideoRoom
