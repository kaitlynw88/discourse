import { useState, useEffect } from "react";
import app from "../firebase.js";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import "../styles/userprofile.scss"

const UserProfile = (props) => {
    
    const [profileData, setProfileData] = useState([]);
    // const [showForm, setShowForm]=useState(false)
    
    let localUser = props.userName
    
    useEffect(()=>{
        const database = getDatabase(app);
        const dbRef = ref(database, "users");
        onValue(dbRef, (resp)=>{
            const data= resp.val()
            for( let key in data){

                if(data[key].email === localUser){
                    setProfileData(data[key].info)
                    return
                }
            }
        })

    },[localUser])

    // const handleForm =()=>{
    //     setShowForm(!showForm)
    // }

    return (
        <div className="userProfile">
            {profileData.firstname || profileData.lastname ? (
                <>
                    <div>
                        <p>
                            {profileData.firstname} {profileData.lastname}
                        </p>
                    </div>
                    <p>bio: {profileData.bio}</p>
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
