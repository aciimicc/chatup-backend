module.exports = (io) => {
    io.on("connection", (socket) => {
      console.log("New user connected");
  
      socket.on("sendMessage", (data) => {
        io.to(data.chatId).emit("receiveMessage", data);
      });
  
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  };
  