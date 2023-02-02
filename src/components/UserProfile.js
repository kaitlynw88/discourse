// import { useState, useEffect } from "react";
// import app from "../firebase.js";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { Link } from "react-router-dom";
// import "../styles/userprofile.scss"

// const UserProfile = (props) => {
    
//     const [profileData, setProfileData] = useState([]);
//     // const [showForm, setShowForm]=useState(false)
    
//     let localUser = props.userEmail
    

//     // const handleForm =()=>{
//     //     setShowForm(!showForm)
//     // }

//     return (

//         <div className="userProfile">
//             {props.profile.firstname || props.profile.lastname ? (
//                 <>
//                     <div>
//                         <p>
//                             {props.profile.firstname} {props.profile.lastname}
//                         </p>
//                     </div>
//                     <p>bio: {props.profile.bio}</p>

//                 </>
//             ) : (
//                 <>
//                     <div>
//                         <p>please set up your profile here</p>

//                         <button>
//                             <Link to="/ProfileForm">
//                                 profile setup
//                             </Link>
//                         </button>
                       
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default UserProfile;

// import { useState } from "react";
// import app from "../firebase.js";
// import { getDatabase, ref, onValue } from "firebase/database";
// import ProfileForm from "./ProfileForm.js";
import { Link } from "react-router-dom";

const UserProfile = (props) => {
    // const [profileData, setProfileData] = useState([]);
    // const [showForm, setShowForm] = useState(false);

    // let localUser = props.userEmail;

   

    return (
        <div>
            {/* <h2>hello</h2> */}
            {console.log(props, "profile props")}
            {props.profile ? (
                <>
                    <p>
                        {props.profile.firstName} {props.profile.lastName}
                    </p>
                    <div>
                        <p>{props.profile.bio}</p>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <p>please set up your profile here</p>
                        
                        <button>
                            <Link to="/ProfileForm">profile setup</Link>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;