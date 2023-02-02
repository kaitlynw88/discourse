import { useState, useEffect } from "react";
import app from "../firebase.js";
import { getDatabase, ref, onValue } from "firebase/database";
import ProfileForm from "./ProfileForm.js";

const UserProfile = (props) => {
    
    const [profileData, setProfileData] = useState([]);
    const [showForm, setShowForm]=useState(false)
    
    let localUser = props.email
    

    const handleForm =()=>{
        setShowForm(!showForm)
    }

    return (
        <div>
            <h2>hello</h2>
            {props.profile? (
                <>
                    <p>{props.profile.firstname}</p>
                    <p>{props.profile.lastname}</p>
                    <p>{props.profile.bio}</p>
                </>
            ) : (
                <>
                    <div>
                        <p>please set up your profile here</p>
                        <button onClick={handleForm}>Profile Setup</button>
                        {showForm ?
                        <ProfileForm userName={localUser} />
                        :
                        <></>
                        }
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;
