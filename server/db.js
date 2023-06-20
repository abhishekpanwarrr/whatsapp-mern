const mongoose = require('mongoose');

 const connectDb = async() =>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URL,{
           useNewUrlParser: true,
           useUnifiedTopology: true
        })
        console.log("🚀Mongo connected on", db.connection.host) 
    } catch (error) {
        console.log("🚀 ~ file: db.js:11 ~ connectDb ~ error:", error.message)
        process.exit(1)     
    }
}
module.exports = connectDb