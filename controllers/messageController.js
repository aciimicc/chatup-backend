const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const message = new Message({ chatId, sender: req.user.id, content });
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: "Error Sending Message" });
  }
};
