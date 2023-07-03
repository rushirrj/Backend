const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/Users");
const jobDetails = require("./models/JobDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const IsAuthenticated = require("./middlewares/IsAuthenticated");
dotenv.config();
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(err.satus || 500);
  res.send({
    error: {
      status: err.satus || 500,
      message: err.message,
    },
  });
});
app.get("/healthstatus", (req, resp) => {
  resp.send("Website working fine");
});
app.post("/register", async (req, resp) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !password || !mobile) {
      return resp.status(401).json("Some fields are required");
    }
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return resp.status(400).json({ error: "User already exists" });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      name,
      email,
      password: encryptedPassword,
      mobile,
    });
    const savedUser = await userData.save();
    const jwtToken = jwt.sign({ email }, process.env.SECRET_KEY);
    resp.json({ savedUser, jwtToken });
  } catch (error) {
    resp.send({ error: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Some fields are required");
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      const checkPassword = await bcrypt.compare(password, checkEmail.password);
      if (checkPassword) {
        const jwtToken = jwt.sign({ email }, process.env.SECRET_KEY);
        return res
          .status(200)
          .json({ message: "User logged in successfully", jwtToken });
      }
    }
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    return res.json({ error: "" });
  }
});

app.post("/createjobpost", IsAuthenticated, async (req, res) => {
  try {
    const {
      companyName,
      logoURL,
      jobPosition,
      salary,
      jobType,
      jobMode,
      location,
      jobDescription,
      aboutCompany,
      skillsRequired,
    } = req.body;
    if (
      !companyName ||
      !logoURL ||
      !jobPosition ||
      !salary ||
      !jobType ||
      !jobMode ||
      !location ||
      !jobDescription ||
      !aboutCompany ||
      !skillsRequired
    ) {
      return res.status(401).json({ error: "All fields are required" });
    }
    const newJobPost = new jobDetails({
      companyName,
      logoURL,
      jobPosition,
      salary,
      jobType,
      jobMode,
      location,
      jobDescription,
      aboutCompany,
      skillsRequired,
    });
    const result = await newJobPost.save();
    return res.json({ message: "Job-post created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
app.listen(3001, () => {
  mongoose
    .connect("mongodb+srv://rrj:rrj@cluster0.h47lits.mongodb.net/")
    .then(() => console.log("MongoDB server running successfully"))
    .catch((err) => console.log(err));
  console.log("Server running successfully");
});
