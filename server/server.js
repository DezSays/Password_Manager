require("dotenv").config();
const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = pgp(process.env.DB);
const PORT = 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.get("/api", function (req, res) {
  res.json({
    text: "Howdy",
  });
});

app.get("/api/protected", ensureToken, function (req, res) {
  jwt.verify(req.token, ACCESS_TOKEN_SECRET, function (err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        text: "protected bruh",
        data: data,
      });
    }
  });
});

app.get("/heartbeat", (req, res) => {
  res.send("Heartbeat Steady");
});

app.post("/api/login",  async (req, res) => {
  const { username, pw } = req.body;
  try {
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE username = $1",
      username
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(pw, user.pw);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user_id_auth = user.id;
    const userIDAuth = { id: user_id_auth };
   
    const token = jwt.sign({ userIDAuth }, ACCESS_TOKEN_SECRET);

    res.json({
      token: token,
      message: "Sign in successful boi",
      userID: user_id_auth
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// app.get("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const userData = await db.oneOrNone(
//       "SELECT id, username, email FROM users WHERE id = $1",
//       id
//     );

//     if (!userData) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.json(userData);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return res.status(500).json({ message: "An error occurred while fetching user data" });
//   }

// });

app.get("/users/:id/passwords", ensureToken, async (req, res) => {
  const { id } = req.params;
  try {
    const passwordData = await db.manyOrNone("SELECT * FROM passwords WHERE user_id = $1", id);
    if(passwordData.length > 0){
      res.json(passwordData);
    }
    else{
      res.json({message: "No passwords found for this user."})
    }
  } catch (error) {
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
});

app.post("/users/:id/passwords", ensureToken, async (req, res) => {
  const { notes, site_url, pw, username } = req.body;
  const user_id = req.params.id

  try {
    await db.none(
      "INSERT INTO passwords(user_id, notes, site_url, pw, username) VALUES($1, $2, $3, $4, $5)",
      [user_id, notes, site_url, pw, username]
    );
    res.json({ message: "Password added successfully" });
  } catch (error) {
    console.error("Error adding password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/signup", async (req, res) => {
  const { id, email, pw, first_name, last_name, username, avatar_url } =
    req.body;
  try {
    const existingUser = await db.oneOrNone(
      "SELECT * FROM users WHERE username = $1",
      username
    );
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const hashed = await bcrypt.hash(pw, 10);
    await db.none(
      "INSERT INTO users(id, email, pw, first_name, last_name, username, avatar_url) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [id, email, hashed, first_name, last_name, username, avatar_url]
    );
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// // update passwords put route
// // delete passwords delete route
// // delete user? not required but would be nice


app.listen(PORT, function () {
  console.log(`app listening bruh. Port ${PORT} boi.`);
});
