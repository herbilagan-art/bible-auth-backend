const express = require("express");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");

const router = express.Router();

// Facebook Login
router.get("/facebook",
  passport.authenticate("facebook", {
    scope: ["email"]
  })
);
router.get("/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/failure",
    session: false
  }),
  (req, res) => {
    console.log("🔍 Facebook callback triggered");
    console.log("🔍 Passport returned user:", req.user);

    if (!req.user || !req.user._id) {
      console.warn("⚠️ Missing user or user._id in Facebook callback");
      return res.status(500).json({ message: "❌ No valid user returned from Facebook strategy" });
    }

    try {
      const token = generateToken(req.user._id);
      console.log("✅ JWT generated:", token);
      res.json({ message: "✅ Facebook login successful", token });
    } catch (err) {
      console.error("❌ Error generating JWT:", err);
      res.status(500).json({ message: "❌ Failed to generate token", error: err.message });
    }
  }
);

// Google Login
router.get("/google", (req, res, next) => {
  console.log("🔍 Google login route hit");
  next();
}, passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    session: false
  }),
  (req, res) => {
    console.log("🔍 Google callback triggered");
    console.log("🔍 Passport returned user:", req.user);

    if (!req.user || !req.user._id) {
      console.warn("⚠️ Missing user or user._id in Google callback");
      return res.status(500).json({ message: "❌ No valid user returned from Google strategy" });
    }

    try {
      const token = generateToken(req.user._id);
      console.log("✅ JWT generated:", token);
      res.json({ message: "✅ Google login successful", token });
    } catch (err) {
      console.error("❌ Error generating JWT:", err);
      res.status(500).json({ message: "❌ Failed to generate token", error: err.message });
    }
  }
);

// Failure route
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "❌ Authentication failed" });
});

module.exports = router;