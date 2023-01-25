import { useState, useEffect } from "react";
import app from "../firebase.js";
import { getDatabase, ref, onValue, push } from "firebase/database";

const UserProfile = () => {
    const [user, setUser] = useState([]);
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");

     useEffect(() => {
         const database = getDatabase(app);
         const dbRef = ref(database, "users");

         onValue(dbRef, (resp) => {
             const data = resp.val();
             const updatedDatabaseInfo = [];

             for (let key in data) {
                 updatedDatabaseInfo.push({
                     key: key,
                     name: data[key],
                 });
             }
             // Passing that array INTO our setComments function to update our stateful variable

             setUser(updatedDatabaseInfo);
         });
     }, []);


    const handlefirstNameChange = (e) => {
        setFirstName(e.target.value);
    };
    const handlastNameChange = (e) => {
        setLastName(e.target.value);
    };
    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userObject = {
            firstname: firstName,
            lastname: lastName,
            age:age,
        };

        const database = getDatabase(app);
        const dbRef = ref(database, "users");

        push(dbRef, userObject);

        setFirstName("");
        setLastName("");
        setAge("");
    };

    return (
        <div>{}
            <h2>This is the user profile page</h2>
            <form action="submit">
                <input
                    type="text"
                    id="firstName"
                    onChange={handlefirstNameChange}
                    value={firstName}
                />

                <input
                    type="text"
                    id="lastName"
                    onChange={handlastNameChange}
                    value={lastName}
                />
                <input
                    type="number"
                    id="age"
                    onChange={handleAgeChange}
                    value={age}
                />
                <button onClick={handleSubmit}>Submit info</button>
            </form>
            <p>
                {user.map((indUser) => {
                    console.log(indUser.name.firstName);
                    return (
                        <li key={indUser.key}>
                            <p>{indUser.name.firstname}</p>
                            <p>{indUser.name.lastname}</p>
                            <p>{indUser.name.age}</p>
                        </li>
                    );
                })}
            </p>
        </div>
    );
};

export default UserProfile;
