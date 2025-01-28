import express from "express";
import cors from "cors";

import userModel from "./user.js";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

/*const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const idGenerator = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const addUser = (user) => {
  user.id = idGenerator();
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const userIndex = users["users_list"].findIndex((user) => user["id"] === id);
  if (userIndex !== -1) {
    users["users_list"].splice(userIndex, 1);
    return true;
  }
  return false;
};
*/

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await userServices.findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send({ users_list: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.post("/users", async (req, res) => {
  const userToAdd = req.body;
  try {
    const newUser = await userServices.addUser(userToAdd);
    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let deleted = await userModel.findByIdAndDelete(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send("Resource not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
