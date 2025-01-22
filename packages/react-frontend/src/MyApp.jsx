// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = React.useState([]);

  function removeOneCharacter(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prevCharacters) =>
            prevCharacters.filter((character) => character.id !== id)
          );
        } else if (res.status === 404) {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((newUser) => {
        setCharacters((prevCharacters) => [...prevCharacters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Failed to add user");
        }
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
