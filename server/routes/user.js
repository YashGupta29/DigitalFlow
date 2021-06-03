const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//@route POST api/user/register
//@desc  Register User
//access Public
router.post("/register", async (req, res) => {
  const { username, name, email, password, address, mobile } = req.body;

  try {
    const user1 = await User.findOne({ username: username });
    const user2 = await User.findOne({ email: email });
    if (user1) {
      res.status(400).json({ msg: "Username Taken" });
    }
    if (user2) {
      res.status(400).json({ msg: "Email already register" });
    }

    const newUser = new User({
      username,
      name,
      email,
      password,
      address,
      mobile,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    console.log(err.message);
  }
});

//@route POST api/user/login
//@desc  Login User
//access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) console.log(err.message);
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
  }
});

//@route GET api/user
//@desc  Ge Logged in User Details
//access Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
