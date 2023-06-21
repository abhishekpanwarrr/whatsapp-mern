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
    socket.join(userData._id)
    console.log("user data id",userData._id);
    socket.emit("connected ")
  })

  socket.on("join chat",(room) =>{
    socket.join(room )
    console.log("User joined room " + room);
  }) 
})