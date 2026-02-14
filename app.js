require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🔥 CONNECT AUTH ROUTES (THIS WAS MISSING)
app.use("/", require("./routes/auth"));

// Protected Dashboard
const User = require("./models/user");

app.get("/dashboard", async (req, res) => {
    if (!req.session.userId) return res.redirect("/login");

    const user = await User.findById(req.session.userId);

    res.render("dashboard", { user });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});