const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

require("./socket/socket")(io);

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

server.listen(5000, () => console.log("Server running on port 5000"));
