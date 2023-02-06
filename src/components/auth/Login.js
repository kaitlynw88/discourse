import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../../styles/authstyles.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const login = (e) => {
            e.preventDefault();
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                   
                    navigate("/")
                })
                .catch(() => {
                    setError("failed to load into account");
                });
                setPassword("")
                setEmail("")
                setError("")
        
    };

    return (
        <div className="authContainer">
            <h1>Log into your account</h1>
            {error && <p>{error}</p>}
            <form onSubmit={login}>
                <p>
                    please make sure to use a valid university or college email
                </p>
                <input
                    required
                    type="email"
                    placeholder="enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    required
                    type="password"
                    placeholder="enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="authButton" type="submit">
                    login
                </button>
            </form>

            <div>
                <h3>
                    Need to make an account?
                    <Link to="/signup"> Signup</Link>
                </h3>
            </div>
        </div>
    );
};

export default Login;
