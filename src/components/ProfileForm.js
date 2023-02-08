import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Avatar from "@mui/material/Avatar";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../styles/profileform.scss"

const ProfileForm = () => {
    const [user, setUser] = useState({});

    // eslint-disable-next-line
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "users");
    const [submitedForm, setSubmittedForm] = useState(false);
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    email: user.email,
                    firstName: "",
                    lastName: "",
                    age: "",
                    bio: "",
                    avatar: null,
                });
            }
        });

        console.log(user);
        return () => {
            listen();
        };
        // eslint-disable-next-line
    }, [setUser]);

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

        if (field === "file") {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert("Please upload an image first!");
        }

        const storageRef = ref(storage, `/images/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setUser({ ...user, avatar: url });
                });
            }
        );
    };

    useEffect(() => {
        if (user.avatar) {
            console.log(user.avatar);
        }
        // eslint-disable-next-line
    }, [user.avatar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(authUser.email)
        await addDoc(usersCollectionRef, user);
        setSubmittedForm(true);
    };
    return (
        <div className="profileForm">
            {!submitedForm ? (
                <form action="submit">
                    <h2>Set up your profile:</h2>
                    <Avatar
                        alt="Remy Sharp"
                        src={user.avatar}
                        sx={{ width: 156, height: 156 }}
                    />
                    <input className="uploadInput" type="file" id="file" onChange={handleChange} />
                    <button className="authButton" onClick={handleUpload}>Upload</button>
                    <p>{percent}% uploaded</p>
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
            ) : (
                <>
                    <p>your profile was successfully submitted</p>
                    <button className="authButton">
                        <Link to="/">Back to home</Link>
                    </button>
                </>
            )}
        </div>
    );
};

export default ProfileForm;