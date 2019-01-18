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
      console.log(email+ password)
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "User not Found" });
        }

        if(!bcrypt.compareSync(password, user.password)){
          return done(null, false , {message:'password is incoorect'})
        }
        console.log('sucssfully password is valid')
        return done(null, user);
        
      });
    }
  )
);

// Google Strategy

passport.use(
  new googleStrategy(
    {
      clientID: "73759076416-f0m22op9fhh6j57qherlm827qjsus6e7.apps.googleusercontent.com",
      clientSecret: "FTEPml5jUbsB3IXBVrWyC6Fe",
      callbackURL: "http://localhost:3000/auth/google/callbacks"
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value
      
      }, console.log(profile));
      if (existingUser) {
        return done(null, existingUser);
      }
      console.log(profile);
      const user = await new User({
        firstName: profile.displayName.split(" ")[0],
        lastName: profile.displayName.split(" ")[1],
        email: profile.emails[0].value,
        DOB: profile.birthday,
        through : 'google'
      }).save();
      console.log(user)
      done(null, user);
    }
  )
);

//Facebook Strategy

passport.use(
  new facebookStrategy(
    {
      clientID: "2184697331780991",
      clientSecret: "c3be638bc4e5fe152b70d340a7e9dcdc",
      callbackURL: "http://localhost:3000/auth/facebook/callbacks",
      enableProof: true,
      profileFields: ["id", "emails", "name", "birthday"]
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value
      }, console.log(profile));
      if (existingUser) {
        return done(null, existingUser);
      }
      
      const user = await new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        DOB: profile.birthday,
        through : 'facebook'
      }).save();
      console.log(user)
      done(null, user);
    }
  )
);

