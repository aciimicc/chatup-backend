const express = require("express");
const Chat = require("../models/Chat");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /chats
 * @desc    Create a new chat between two users
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  const { userId } = req.body; // The ID of the user to chat with
  const loggedInUserId = req.user.id;

  try {
    // Check if a chat already exists between these users
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [loggedInUserId, userId] },
    });

    if (!chat) {
      chat = new Chat({
        chatName: "Private Chat",
        isGroupChat: false,
        users: [loggedInUserId, userId],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   GET /chats
 * @desc    Get all chats of the logged-in user
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user.id })
      .populate("users", "name email")
      .populate("latestMessage");
    
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   POST /chats/group
 * @desc    Create a new group chat
 * @access  Private
 */
router.post("/group", authMiddleware, async (req, res) => {
  const { chatName, users } = req.body;

  if (!users || users.length < 2) {
    return res.status(400).json({ message: "At least two users are required to create a group chat." });
  }

  try {
    const groupChat = new Chat({
      chatName,
      isGroupChat: true,
      users: [...users, req.user.id], // Add the creator to the group
      groupAdmin: req.user.id,
    });

    await groupChat.save();
    res.status(201).json(groupChat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   PUT /chats/group/:chatId
 * @desc    Add a user to a group chat
 * @access  Private
 */
router.put("/group/:chatId", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat." });
    }

    chat.users.push(userId);
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   DELETE /chats/group/:chatId
 * @desc    Remove a user from a group chat
 * @access  Private
 */
router.delete("/group/:chatId", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat." });
    }

    chat.users = chat.users.filter((id) => id.toString() !== userId);
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
