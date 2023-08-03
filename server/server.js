require("dotenv").config();
const express = require("express");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3003;
const db = pgp(process.env.DB);

app.use(express.json());

app.get("/heartbeat", (req, res) => {
  res.send("Heartbeat Steady");
});

app.get("/users", async (req, res) => {
  const userData = await db.manyOrNone("SELECT * FROM users");
  res.json(userData);
});

app.get("/passwords", async (req, res) => {
  const passwordData = await db.manyOrNone("SELECT * FROM passwords");
  res.json(passwordData);
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
