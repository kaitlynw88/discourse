import React from 'react'
import { useState, useEffect } from "react";
import app from "../firebase.js"
import { getDatabase, ref, onValue, push, remove } from "firebase/database";

const ChatContainer = (props) => {
    const [comments, setComments] = useState([]);

    const [userInput, setUserInput] = useState("");

   console.log(props.userName);

    useEffect(() => {
        const database = getDatabase(app);
        const dbRef = ref(database, "comments");

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
    }, []);

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
        const dbRef = ref(database, "comments");

        push(dbRef, commentObject);

        setUserInput("");
    };

    const handleRemoveComment = (commentId) => {
        const database = getDatabase(app);
        const dbRef = ref(database, `comments/${commentId}`);

        remove(dbRef);
    };
  return (
      <div>
          <div className="App wrapper">
          <h3>THis is the chat box</h3>
              <ul id="displayedComments">
                  {comments.map((indComment) => {
                      // console.log(indComment.key)
                      return (
                          <li key={indComment.key}>
                              <p>{indComment.name.comment}</p>
                              <p>{indComment.name.username}</p>

                              <button
                                  className="closeButton"
                                  onClick={() =>
                                      handleRemoveComment(indComment.key)
                                  }
                              >
                                  X
                              </button>
                          </li>
                      );
                  })}
              </ul>
              <form action="submit">
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