/*
 * USER Model File
 *
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Users Schema
const usersSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String,
  DOB: String,
  through : String
  
});

module.exports = mongoose.model("user", usersSchema);


