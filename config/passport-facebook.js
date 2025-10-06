const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["id", "emails", "name"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      user = await User.create({
        facebookId: profile.id,
        email: profile.emails?.[0]?.value || "",
        name: `${profile.name.givenName} ${profile.name.familyName}`
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));