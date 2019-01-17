/*
 *  User authentication routes file
 *
 */

// Dependencies
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = app => {
  // Register a User route
  app.post("/user/signup", (req, res) => {
    //Register the User to the DB
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!err && user) {
        res.send({ Error: "Email Exists" });
      } else if (!user) {
        bcrypt.genSalt(10, (err, salt) => {
          if (!err && salt) {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (!err && hash) {
                const userDetails = {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  password: hash,
                  DOB: req.body.dob,
                  salt
                };

                User.create(userDetails, err => {
                  if (!err) {
                    res.status(200).send("Saved sucessfully");
                    passport.authenticate("local");
                  } else {
                    console.log(err);
                    res.status(500).send({ Error: "Error saving to database" });
                  }
                });
              } else {
                console.log(err, "Error hashing pass");
              }
            });
          } else {
            console.log(err, "Unable to generate salt");
          }
        });
      }
    });
  });

  //Login the User
  app.post("/user/login", passport.authenticate("local"), (req, res) => {
    // @TODO add logic of what to do after login
    res.status(200);
  });

  //Google OAuth2
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      // @TODO add logic of what to do after login
      res.status(200);
    }
  );

  //Facebook OAuth2
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: "email" })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      // @TODO add logic of what to do after login
      res.status(200);
    }
  );

  //Logout
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
