
import { useEffect, useState } from "react";

import app from "../firebase.js";
import { Link, redirect } from "react-router-dom";
import { getDatabase, ref, push } from "firebase/database";
import {db} from "../firebase";
import {collection, getDocs, addDoc} from "firebase/firestore";
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

    const [users, setUsers]=useState([])
    const usersCollectionRef=collection(db, "users")

        const userObject = {
            email: authUser.email,
            info: {
                firstname: firstName,
                lastname: lastName,
                age: age,
                bio: bio,
            },
        };


    useEffect(()=>{
        const getUsers = async ()=>{
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
        }
            getUsers();
    },[])


    const handleChange=(e)=>{
        let field=e.target.id
        if(field==="firstName"){
            setUser({...user, firstName:e.target.value })
        }
       
        if(field==="lastName"){
            setUser({...user, lastName:e.target.value })
        }

        if(field==="age"){
            setUser({...user, age:e.target.value })
        }

        if(field==="bio"){
            setUser({...user, bio:e.target.value })
        }
    }

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        await addDoc(usersCollectionRef,user)
    };
    return (
        <div>{
            console.log(props,'mypropsm')
            }

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
