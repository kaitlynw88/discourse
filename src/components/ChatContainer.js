import React from 'react'
import { useState, useEffect } from "react";
import app from "../firebase.js"
import { getDatabase, ref, onValue, push } from "firebase/database";
import "../styles/chatcontainer.scss"

const ChatContainer = (props) => {
    const [comments, setComments] = useState([]);

    const [userInput, setUserInput] = useState("");

   console.log(props.userName);

    useEffect(() => {
        const database = getDatabase(app);
        const dbRef = ref(database, `comments/${props.channel}`);

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

            setComments(updatedDatabaseInfo);
        });
    }, [props.channel]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const commentObject = {
            comment: userInput,
            username: props.userName,
        };

        const database = getDatabase(app);
        const dbRef = ref(database, `comments/${props.channel}`);

        push(dbRef, commentObject);

        setUserInput("");
    };

  return (
      <div>
          <div className="chatContainer">
          <h3>Comments:</h3>
              <ul className="displayedComments" id="displayedComments">
                  {comments.map((indComment) => {
                      console.log(indComment)
                      return (
                          <li key={indComment.key}>
                              <p>{indComment.name.comment}</p>
                              <p className='username'>{indComment.name.username}</p>
                          </li>
                      );
                  })}
              </ul>
              <form className="chatForm" action="submit">
                  <input
                      type="text"
                      id="newComment"
                      onChange={handleInputChange}
                      value={userInput}
                  />

                  <button className="postButton" onClick={handleSubmit}>
                      Post
                  </button>
              </form>

          </div>
      </div>
  );
}

export default ChatContainer