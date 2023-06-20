const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "Empty fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const newUser = await User.create({
      name,
      email,
      password,
      picture:pic,
    });

    if (newUser) return res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
        token: generateToken(newUser._id),
      });
     
      res.status(400).json({ message: "Failed to create user" });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const newUser = await User.findOne({email})
        if(newUser && (await newUser.matchPassword(password)))return res.status(200).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id),
          });

          res.status(400).json({ message: "Invalid email or password" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = {
  register,
  login,
};
