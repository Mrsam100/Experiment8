const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());
MONNGO_URI="mongodb://aayushcoder2023_db_user:1234@ac-omurmfs-shard-00-00.mavodru.mongodb.net:27017,ac-omurmfs-shard-00-01.mavodru.mongodb.net:27017,ac-omurmfs-shard-00-02.mavodru.mongodb.net:27017/?ssl=true&replicaSet=atlas-fk5fy4-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
// User Schema
const User = mongoose.model("User", {
  email: String,
  password: String,
  role: String
});

// Dummy Register (for testing)
app.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashed,
      role: req.body.role || "user"
    });

    await user.save();

    console.log("User saved");
    res.send("User registered");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }
});

// Login API (Exp 3.1.1 + 3.1.2)
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secretkey"
  );

  res.json({ token, role: user.role });
});
// Verify Token
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
}

// Role Check (Exp 3.1.3)
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }
  next();
}

// Protected Route
app.get("/dashboard", auth, (req, res) => {
  res.send("Welcome User Dashboard");
});

// Admin Route
app.get("/admin", auth, isAdmin, (req, res) => {
  res.send("Welcome Admin");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on " + PORT));