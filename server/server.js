require("dotenv").config();
const express = require("express");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const cors = require('cors');
const app = express();
const PORT = 3003;
const db = pgp(process.env.DB);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors());
// Middleware to check and decode JWT token
const checkAuth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Apply the checkAuth middleware to protected routes
app.use("/users/:id/passwords", checkAuth);
app.use("/passwords", checkAuth);

app.get("/heartbeat", (req, res) => {
  res.send("Heartbeat Steady");
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await db.oneOrNone(
      "SELECT id, username, email FROM users WHERE id = $1",
      id
    );
    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
  
    return res.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "An error occurred while fetching user data" });
  }
  
});

app.get("/users/:id/passwords", async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ message: "Invalid ID" });
  }
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
    const hashedPassword = await bcrypt.hash(pw, 10);
    await db.none(
      "INSERT INTO users(id, email, pw, first_name, last_name, username, avatar_url) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [id, email, hashedPassword, first_name, last_name, username, avatar_url]
    );
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
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
    res.json({ message: "Sign-in successful" });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/passwords", async (req, res) => {
  const { notes, site_url, pw, username } = req.body;
  const user_id = req.user.user_id;

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

// add passwords post route
// update passwords put route
// delete passwords delete route
// delete user? not required but would be nice
// use jwt for auth


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
