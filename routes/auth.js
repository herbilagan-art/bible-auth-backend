const express = require("express");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const User = require("../models/User"); // adjust path/model name as needed

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//
// --- Existing Passport-based Web OAuth flows ---
//

// Facebook Login (Web)
router.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
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

// Google Login (Web)
router.get("/google", (req, res, next) => {
  console.log("🔍 Google login route hit");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

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

//
// --- New Mobile-friendly POST endpoints for Flutter ---
//

// Google Mobile Login
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "❌ No token provided" });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      });
    }

    const jwt = generateToken(user._id);
    res.json({ jwt, user });
  } catch (err) {
    console.error("❌ Google mobile login error:", err);
    res.status(500).json({ message: "❌ Google login failed", error: err.message });
  }
});

// Facebook Mobile Login
router.post("/facebook", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "❌ No token provided" });

    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    );
    const fbData = await fbRes.json();
    if (fbData.error) throw new Error(fbData.error.message);

    let user = await User.findOne({ facebookId: fbData.id });
    if (!user) {
      user = await User.create({
        facebookId: fbData.id,
        email: fbData.email,
        name: fbData.name,
        avatar: fbData.picture?.data?.url,
      });
    }

    const jwt = generateToken(user._id);
    res.json({ jwt, user });
  } catch (err) {
    console.error("❌ Facebook mobile login error:", err);
    res.status(500).json({ message: "❌ Facebook login failed", error: err.message });
  }
});

module.exports = router;