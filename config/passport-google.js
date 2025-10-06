const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  console.log("🔍 Google profile received:", {
    id: profile.id,
    email: profile.emails?.[0]?.value,
    displayName: profile.displayName
  });

  try {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      console.log("✅ Existing user found:", existingUser._id);
      return done(null, existingUser);
    }

    const newUser = new User({
      googleId: profile.id,
      email: profile.emails?.[0]?.value || "no-email@google.com"
    });

    await newUser.save();
    console.log("✅ New user created:", newUser._id);
    return done(null, newUser);
  } catch (err) {
    console.error("❌ Error in Google strategy:", err);
    return done(err, null);
  }
}));