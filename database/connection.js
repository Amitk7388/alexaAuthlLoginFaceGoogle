/*
 * Database connection file
 *
 */

const mongoose = require("mongoose");

//@TODO add DB url
const DB = "mongodb://localhost/test";
mongoose.connect(
  DB,
  { useNewUrlParser: true }
);
