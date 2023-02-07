import { Link } from "react-router-dom";
import "../styles/userprofile.scss"
import "../styles/basestyles.scss"

const UserProfile = (props) => {
    
    return (
        <div className="userProfile">
            {/* <h2>hello</h2> */}
            {props.profile ? (
                <>
                    <h3 className="userName">
                        {props.profile.firstName} {props.profile.lastName}
                    </h3>
                    <div>
                        <p>{props.profile.bio}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="setUpProfile">
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