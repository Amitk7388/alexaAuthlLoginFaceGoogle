/*
 * User passport authentication service
 *
 */

//Dependencies
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const facebookStrategy = require("passport-facebook");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Passport Cofiguration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//Passport Local Strategy
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      // Finding the user in the DB
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "User not Found" });
        }
        if (validPassword(password, user.password)) {
          return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, user);
      });
    }
  )
);

// Google Strategy

passport.use(
  new googleStrategy(
    {
      clientID: "183278019820-slrrbdh9f0dchg72a73l28267ht7muqi.apps.googleusercontent.com",
      clientSecret: "YYQhLNaO3lLGc-IZ-Ciuxm21 ",
      callbackURL: "http://127.0.0.1:3000/auth/google/callbacks"
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value
      });
      if (existingUser) {
        return done(null, existingUser);
      }
      console.log(profile);
      const user = await new User({
        firstName: profile.displayName.split(" ")[0],
        lastName: profile.displayName.split(" ")[1],
        email: profile.emails[0].value,
        DOB: profile.birthday
      }).save();
      done(null, user);
    }
  )
);

//Facebook Strategy

passport.use(
  new facebookStrategy(
    {
      clientID: "<@TODO Add your credentials>",
      clientSecret: "<@TODO Add your credentials>",
      callbackURL: "/auth/facebook/callback",
      enableProof: true,
      profileFields: ["id", "emails", "name", "birthday"]
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value
      });
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        DOB: profile.birthday
      }).save();
      done(null, user);
    }
  )
);

//Function to check password with DB
function validPassword(password, hashedPassword) {
  bcrypt.compare(password, hashedPassword).then(res => {
    if (res) {
      return true;
    }
  });
  return false;
}
