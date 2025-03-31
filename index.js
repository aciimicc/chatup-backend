require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Sample route
app.get("/", (req, res) => {
  res.send("Chat API is running!");
});

// Example route to test JWT
app.post("/generate-token", (req, res) => {
  const token = jwt.sign({ userId: "12345" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

app.listen(5000, () => console.log("Server running on port 5000"));

module.exports = app;
