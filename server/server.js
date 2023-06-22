const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const connectDb = require("./db");

// Routes import
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


// Configuration settings
dotenv.config();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT || 4000;

// Routes
app.use("/api/user", userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)

 
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server listing 
const server = app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
  connectDb();
});

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors:{
  origin:"http://localhost:3000"
}});

io.on("connection",(socket) =>{
  socket.on("setup",(userData) =>{
    socket.join(userData?._id)
    console.log("user data id",userData?._id);
    socket.emit("connection")
  })

  socket.on("join chat",(room) =>{
    socket.join(room )
    console.log("User joined room " + room);
  }) 

  socket.on("typing",(room) => socket.in(room).emit("typing"))
  socket.on("stop typing",(room) => socket.in(room).emit("stop typing"))

  socket.on("new message",(newMessageRecieved) =>{
    let chat = newMessageRecieved.chat
    if(!chat.users) return console.log("Chat.users not defined");
    chat.users.forEach(user => {
      if(user._id == newMessageRecieved.sender._id) return
      console.log("here");
      socket.in(user._id).emit("message received",newMessageRecieved)
    } )
  })
  socket.off("setup",() =>{
    console.log("User disconnected");
    socket.leave(userData._id)
  })
})