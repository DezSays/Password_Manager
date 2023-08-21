require("dotenv").config();
const express = require("express");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt"); 
const cors = require('cors');
const app = express();
const PORT = 3003;
const db = pgp(process.env.DB);
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('secret:', process.env.ACCESS_TOKEN_SECRET);
  // console.log('token:', token);

  if (token === null) {

    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userIDAuth) => {
    if (err) {
      console.log('Verification error:', err);
      return res.sendStatus(401);
    }
    req.userIDAuth = userIDAuth;
    
    next();
  });
}



app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}))
/
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

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

app.post("/signin", authenticateToken, async (req, res) => {
  const { username, pw } = req.body;
  console.log(req.userIDAuth)
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
    const user_id_auth = user.id
    const userIDAuth = {id: user_id_auth}
    const test = jwt.sign(userIDAuth, process.env.ACCESS_TOKEN_SECRET);
    res.json({ token: test, message: `Sign-in successful` });
    
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
