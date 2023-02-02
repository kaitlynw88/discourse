import { useState, useEffect } from "react";
import app from "../firebase.js";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import "../styles/userprofile.scss"

const UserProfile = (props) => {
    
    const [profileData, setProfileData] = useState([]);
    // const [showForm, setShowForm]=useState(false)
    
    let localUser = props.userEmail
    

    // const handleForm =()=>{
    //     setShowForm(!showForm)
    // }

    return (

        <div className="userProfile">
            {props.profile.firstname || props.profile.lastname ? (
                <>
                    <div>
                        <p>
                            {props.profile.firstname} {props.profile.lastname}
                        </p>
                    </div>
                    <p>bio: {props.profile.bio}</p>

                </>
            ) : (
                <>
                    <div>
                        <p>please set up your profile here</p>

                        <button>
                            <Link to="/ProfileForm">
                                profile setup
                            </Link>
                        </button>
                       
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;
