const jwt = require('jsonwebtoken');
const User = require('../models/User')
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async(req,res,next) =>{
    let token;

    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        try {
            token = req.headers.authorization.split(" ")[1]
            // decoded token
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

            req.user = await User.findById(decodedToken.id).select("-password")
            next();

        } catch (error) {
            res.status(401).json({message:error.message})
        }
    }
    if (!token) {
        return res.status(401).json({message:"You are not authorized."})
      }
      console.log("🚀 ~ file: authMiddleware.js:26 ~ protect ~ token:", token)
})


module.exports = { protect };