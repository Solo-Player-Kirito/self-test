const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user_auth");
// const cloudinary = require("cloudinary");
const multer = require("multer");
// const storage = multer.memoryStorage;
const { storage } = require("../cloudinary/cloudinary.confi");
const upload = multer({ storage });

// Test route
router.get("/test", async (req, res) => {
  try {
    const getdata = await User.find();
    if (!getdata) {
      return res.send("failed fetching");
    }
    res.json({ getdata });
  } catch (err) {
    res.json({ err });
  }
});
// Register route
router.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log request body for debugging

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "Registered successfully",
      user: savedUser,
    });
  } catch (err) {
    console.error("Error during registration:", err); // Log detailed error
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user wrong email" });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(401).json({ message: "user wrong password" });
    }
    const { password: _, ...userwithoutpassword } = user.toObject();

    res.status(201).json({ message: "logged in", userwithoutpassword });
  } catch (err) {
    res.status(500).json({ message: "error occured", err });
  }
});
// router.post("/uploadImg", async (req, res) => {
//   const { file } = req.body;
//   if (!file) {
//     return res.status(401).json({ message: "plz select file" });
//   }

//   // upload.
// });
router.post("/upload", upload.array("file", 100), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save file paths to the user document
    const fileUrls = req.files.map((file) => file.path);
    user.files = fileUrls;
    user.files.push(...fileUrls);
    await user.save();

    res
      .status(201)
      .json({ message: "Files uploaded successfully", files: fileUrls });
  } catch (err) {
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
});
module.exports = router;
