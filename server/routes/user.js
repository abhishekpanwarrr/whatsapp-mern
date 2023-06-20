const express = require('express');
const { register, login, getAllUsers } = require('../controller/user');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route("/").post(register).get(protect,getAllUsers)
router.post("/login",login)
module.exports = router