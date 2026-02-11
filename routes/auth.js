const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// Register Page
router.get("/register", (req, res) => {
    res.render("register");
});

// Register Logic
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.redirect("/login");
});

// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Login Logic
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send("Wrong password");

    req.session.userId = user._id;
    res.redirect("/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;