import { Link } from "react-router-dom";

const UserProfile = (props) => {
    
    return (
        <div>
            {/* <h2>hello</h2> */}
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