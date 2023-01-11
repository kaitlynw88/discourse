// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCT24p_b_F5MRoutWr_r_LH8kNih7VaEoI",
    authDomain: "discourse-6377c.firebaseapp.com",
    projectId: "discourse-6377c",
    storageBucket: "discourse-6377c.appspot.com",
    messagingSenderId: "998958506620",
    appId: "1:998958506620:web:b49f44c2472b9d5f80dff9",
    measurementId: "G-M9KCLJCJKC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;


