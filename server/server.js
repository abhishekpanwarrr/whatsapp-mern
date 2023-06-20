const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const connectDb = require("./db");

// Routes import
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


// Configuration settings
dotenv.config();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT || 4000;

// Routes
app.use("/api/user", userRouter)
app.use("/api/chat",chatRouter)

 
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server listing 
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
  connectDb();
});
