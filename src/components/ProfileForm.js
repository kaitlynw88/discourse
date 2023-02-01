import { useState } from "react";
import app from "../firebase.js";
import { Link } from "react-router-dom";
import { getDatabase, ref, push } from "firebase/database";

const ProfileForm = (props) => {

    let localUser = props.userName;
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("");

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
        console.log("click");

        const database = getDatabase(app);
        const dbRef = ref(database, "users");

        // onValue(dbRef, (resp) => {
        //     const data = resp.val();
        //     const updatedDatabaseInfo = [];

        //     for (let key in data) {
        //         updatedDatabaseInfo.push({
        //             key: key,
        //             user: data[key],
        //         });
        //     }
        //     setUsers(updatedDatabaseInfo);
        // });

        const userObject = {
            email: localUser,
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
    };
    return (
        <div>
            <form action="submit">
                <h2>Set up your profile:</h2>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    onChange={handlefirstNameChange}
                    value={firstName}
                />

                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    onChange={handlastNameChange}
                    value={lastName}
                />
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    onChange={handleAgeChange}
                    value={age}
                />

                <label htmlFor="bio">Bio:</label>
                <input
                    type="text"
                    id="bio"
                    onChange={handleBioChange}
                    value={bio}
                />
                <button onClick={handleSubmit}>Submit info</button>
            </form>

            <button>
                <Link to="/">Back to home</Link>
            </button>
        </div>
    );
};

export default ProfileForm;
