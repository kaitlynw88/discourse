import { useState, useEffect } from "react";
import app from "../firebase.js";
import { getDatabase, ref, onValue, push } from "firebase/database";

const UserProfile = (props) => {
    const [users, setUsers] = useState([]);
    
    let localUser = props.userName
    
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
                     user: data[key],
                    });
                }
                setUsers(updatedDatabaseInfo);
                console.log(updatedDatabaseInfo)
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
        console.log("click")

        const userObject = {
            email: localUser,
            info:{
                firstname: firstName,
                lastname: lastName,
                age:age,
            }
        };

        const database = getDatabase(app);
        const dbRef = ref(database, "users");
        
        push(dbRef, userObject);

        setFirstName("");
        setLastName("");
        setAge("");
    };

    return (
        <div>
            <h2>Your profile is: {localUser}</h2>

            <div>
                {
                    //check firebase to see if user info exists for user.
                    // if user info exitsts print info
                    //else print form
                    users.map((indUser)=>{
                        console.log(indUser.user.email)
                        if(indUser.user.email === localUser){
                            return(
                                <p>A user exists!!!</p>
                            )
                        }
                        else{
                            return(
                                <p>a user doesnt exists</p>
                            )
                        }
                    })
            
                    

                    
                }
                

                    
                    
                        <p>some words?</p>

                    
                        
                    

                    <form action="submit">
                        <h2>Set up your profile:</h2>
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

                    
                
            </div>
        </div>
    );
};

export default UserProfile;
