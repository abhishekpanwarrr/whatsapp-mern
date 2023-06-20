const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(403).json({ message: "Params are missing" });

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).json(fullChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    console.log("🚀 ~ file: chat.js:55 ~ fetchChats ~ chats:", chats)
    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    console.log("🚀 ~ file: chat.js:59 ~ fetchChats ~ results:", results)
    res.status(200).json(results);
  } catch (error) {
    console.log("🚀 ~ file: chat.js:63 ~ fetchChats ~ error:", error)
    res.status(500).json({ message: error.message });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name)
    return res.status(400).json({ message: "Empty Fields" });
  try {
    let users = JSON.parse(req.body.users);
    if (users.length < 2)
      return res.status(400).json({ message: "Add more members" });

    users.push(req.user);
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat)
      return res.status(404).json({ message: "Something went wrong" });
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
      
      if(!added) return res.status(400).json({ message:"some error"})
      res.status(200).json(added)
  } catch (error) {}
});

const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

      if(!removed) return res.status(400).json({ message:"some error"})
      res.status(200).json(removed)
  } catch (error) {}
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
};
