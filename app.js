/*
 * Main app.js file for the app
 *
 */

// Dependencies
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local");

//Requiring files
//Db connection
require("./database/connection");
require("./models/User");
// Passport - Services
require("./services/passport");

app.set('view engine', 'ejs');
//Configuration
app.use(cookieParser());
app.use(
  expressSession({
    secret: "<Add your secret here>",
    resave: false,
    saveUninitialized: false
  })
);

//Configuring passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
require("./routes/authRoutes")(app);

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Started at " + PORT));
