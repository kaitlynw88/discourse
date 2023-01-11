import { signOut } from "firebase/auth";
import React from "react";


const HomePage = (props) => {
    const auth = props.userProps

    const userSignOut = () => {
        signOut(auth);
    };

    return (
        <>
            <h2>Homepage</h2>
            <p>user email is:{props.propsUserProps}</p>
            <button onClick={userSignOut}>SignOut</button>
       
    
        </>
    );
};

export default HomePage;
