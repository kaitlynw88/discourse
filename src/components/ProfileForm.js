import { useEffect, useState } from "react";
// import app from "../firebase.js";
import { Link } from "react-router-dom";
// import { getDatabase, ref, push } from "firebase/database";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/profileform.scss"
import "../styles/basestyles.scss"

const ProfileForm = () => {
    // const [authUser, setAuthUser] = useState(null);
    const [user, setUser] = useState({});

    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [submitedForm, setSubmittedForm] = useState(false);

    useEffect(()=>{
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    email: user.email,
                    firstName: "",
                    lastName: "",
                    age: "",
                    bio: "",
                });
            }
        });

        console.log(user);
        return () => {
            listen();
        };
        // eslint-disable-next-line
    },[setUser])
        

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            console.log(users);
        };
        getUsers();
        // eslint-disable-next-line
    }, []);
        
    const handleChange = (e) => {
        let field = e.target.id;
        if (field === "firstName") {
            setUser({ ...user, firstName: e.target.value });
        }

        if (field === "lastName") {
            setUser({ ...user, lastName: e.target.value });
        }

        if (field === "age") {
            setUser({ ...user, age: e.target.value });
        }

        if (field === "bio") {
            setUser({ ...user, bio: e.target.value });
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(authUser.email)
        await addDoc(usersCollectionRef, user);
        setSubmittedForm(true)
    };
    return (
        <div className="profileForm">
            {!submitedForm 
            ?
            <form action="submit">
                <h2>Set up your profile:</h2>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    onChange={handleChange}
                    value={user.firstName}
                    required
                />

                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    onChange={handleChange}
                    value={user.lastName}
                    required
                />
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    onChange={handleChange}
                    value={user.age}
                    required
                />

                <label htmlFor="bio">Bio:</label>
                <textarea
                    type="text"
                    id="bio"
                    onChange={handleChange}
                    value={user.bio}
                    required
                />

                <button className="authButton" onClick={handleSubmit}>Submit info</button>
            </form>
            :
            <>
                <p>your profile was successfully submitted</p>
                <button className="authButton">
                    <Link to="/">Back to home</Link>
                </button>
            </>
}
        </div>
    
    );
};

export default ProfileForm;

// import { useState, useEffect } from "react";
// import app from "../firebase.js";
// import { Link } from "react-router-dom";
// import { getDatabase, ref, push } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";

// const ProfileForm = () => {
//     // let localUser = props.userName;

//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [age, setAge] = useState("");
//     const [bio, setBio] = useState("");
//     const [authUser, setAuthUser] = useState(null);
//     const [submitedForm, setSubmittedForm] = useState(false);
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState({});

//     useEffect(() => {
//         const listen = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setAuthUser(user);
//             } else {
//                 setAuthUser(null);
//             }
//         });

//         return () => {
//             listen();
//         };
//     }, [authUser]);

//         useEffect(() => {
//             // Since we don't have props for the email, we have to get the email from the db again.
//             // if you have a better solution - you can change it

//             const getUsers = async () => {
//                 const data = await getDocs(usersCollectionRef);
//                 setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//                 console.log(users)
//             };
//             getUsers();

//             }, []);

//     const handleChange = (e) => {
//         let field = e.target.id;
//         if (field === "firstName") {
//             setUser({ ...user, firstName: e.target.value });
//         }

//         if (field === "lastName") {
//             setUser({ ...user, lastName: e.target.value });
//         }

//         if (field === "age") {
//             setUser({ ...user, age: e.target.value });
//         }

//         if (field === "bio") {
//             setUser({ ...user, bio: e.target.value });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const database = getDatabase(app);
//         const dbRef = ref(database, "users");

//         const userObject = {
//             email: authUser.email,
//             info: {
//                 firstname: firstName,
//                 lastname: lastName,
//                 age: age,
//                 bio: bio,
//             },
//         };

//         push(dbRef, userObject);

//         setFirstName("");
//         setLastName("");
//         setAge("");
//         setBio("");
//         setSubmittedForm(true);
//     };
//     return (
//         <div className="profileForm">
//             {!submitedForm ? (
//                 <form action="submit">
//                     <h2>Set up your profile:</h2>
//                     <label htmlFor="firstName">First Name:</label>
//                     <input
//                         type="text"
//                         id="firstName"
//                         onChange={handleChange}
//                         value={user.firstName}
//                         required
//                     />

//                     <label htmlFor="lastName">Last Name:</label>
//                     <input
//                         type="text"
//                         id="lastName"
//                         onChange={handleChange}
//                         value={user.lastName}
//                         required
//                     />
//                     <label htmlFor="age">Age:</label>
//                     <input
//                         type="number"
//                         id="age"
//                         onChange={handleChange}
//                         value={user.age}
//                         required
//                     />

//                     <label htmlFor="bio">Bio:</label>
//                     <textarea
//                         type="text"
//                         id="bio"
//                         onChange={handleChange}
//                         value={user.bio}
//                         required
//                     />

//                     <button onClick={handleSubmit}>Submit info</button>
//                 </form>
//             ) : (
//                 <>
//                     <p>your profile was successfully submitted</p>
//                     <button>
//                         <Link to="/">Back to home</Link>
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default ProfileForm;
