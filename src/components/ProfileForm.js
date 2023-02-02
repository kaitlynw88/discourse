import { useState, useEffect } from "react";
import app from "../firebase.js";
import { Link } from "react-router-dom";
import { getDatabase, ref, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProfileForm = () => {
    // let localUser = props.userName;
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("");
    const [authUser, setAuthUser] = useState(null);
    const [submitedForm, setSubmittedForm]=useState(false)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        };
    }, [authUser]);

   

    const handlefirstNameChange = (e) => {
        setFirstName(e.target.value);
    };
    const handlastNameChange = (e) => {
        setLastName(e.target.value);
    };
    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };
    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const database = getDatabase(app);
        const dbRef = ref(database, "users");

        const userObject = {
            email: authUser.email,
            info: {
                firstname: firstName,
                lastname: lastName,
                age: age,
                bio: bio,
            },
        };

        push(dbRef, userObject);

        setFirstName("");
        setLastName("");
        setAge("");
        setBio("");
        setSubmittedForm(true)
    };
    return (
        <div>
            {!submitedForm 
            ?
            <form action="submit">
                <h2>Set up your profile:</h2>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    onChange={handlefirstNameChange}
                    value={firstName}
                    required
                />

                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    onChange={handlastNameChange}
                    value={lastName}
                    required
                />
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    onChange={handleAgeChange}
                    value={age}
                    required
                />

                <label htmlFor="bio">Bio:</label>
                <textarea
                    type="text"
                    id="bio"
                    onChange={handleBioChange}
                    value={bio}
                    required
                />
                <button onClick={handleSubmit}>Submit info</button>
            </form>
            :
            <>
                <p>your profile was successfully submitted</p>
                <button>
                    <Link to="/">Back to home</Link>
                </button>
            </>


            }

        </div>
    );
};

export default ProfileForm;
