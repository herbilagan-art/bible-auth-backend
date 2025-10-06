const express = require("express");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");

const router = express.Router();

// Facebook Login
router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/callback", passport.authenticate("facebook", {
  failureRedirect: "/auth/failure",
  session: false
}), (req, res) => {
  const token = generateToken(req.user._id);
  res.json({ message: "✅ Facebook login successful", token });
});

// Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/auth/failure",
  session: false
}), (req, res) => {
  const token = generateToken(req.user._id);
  res.json({ message: "✅ Google login successful", token });
});

// Failure route
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "❌ Authentication failed" });
});

module.exports = router;