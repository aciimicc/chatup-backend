const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
 try {
    const { name, email, username, password, dob } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, username, password: hashedPassword, dob });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET, // Store your secret in an environment variable
          { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token, user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;