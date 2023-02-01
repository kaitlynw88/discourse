import { useState, useEffect } from "react";
import app from "../firebase.js";
import { getDatabase, ref, onValue } from "firebase/database";
import ProfileForm from "./ProfileForm.js";

const UserProfile = (props) => {
    
    const [profileData, setProfileData] = useState([]);
    const [showForm, setShowForm]=useState(false)
    
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

    const handleForm =()=>{
        setShowForm(!showForm)
    }

    return (
        <div>
            <h2>hello</h2>
            {profileData.firstname || profileData.lastname ? (
                <>
                    <p>{profileData.firstname}</p>
                    <p>{profileData.lastname}</p>
                    <p>{profileData.bio}</p>
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
