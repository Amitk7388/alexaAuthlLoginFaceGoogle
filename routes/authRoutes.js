/*
 *  User authentication routes file
 *
 */

// Dependencies
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = app => {

  app.get('/', (req, res) =>{
    res.render('index.ejs')
  })

  app.get('/user/login', (req, res)=>{
    res.render('login.ejs')
  })

  app.get('/user/signup', (req, res)=>{
    res.render('signup.ejs')
  })
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
                  through : 'local',
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
    res.status(200).send('sucessfully loged in');
    
  });

  //Google OAuth2
  app.get(
    "/auth/google",
    
    passport.authenticate("google", { scope: ["profile", "email"] }), function(req, res){
      console.log('this auth is working')
    }

    
  );

  app.get(
    "/auth/google/callbacks",
    passport.authenticate("google", { failureRedirect: '/login'}),
    (req, res) => {
      // @TODO add logic of what to do after login
      res.status(200).send('authenticated sucessfully');
    }
  );

  //Facebook OAuth2
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: "email" })
  );

  app.get(
    "/auth/facebook/callbacks",
    passport.authenticate("facebook"),
    (req, res) => {
      // @TODO add logic of what to do after login
      res.status(200).send('sucessfully created');
    }
  );

  //Logout
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
