/*
 * Database connection file
 *
 */

const mongoose = require("mongoose");

//@TODO add DB url
const DB = "https://localhost/test";
mongoose.connect(
  DB,
  { useNewUrlParser: true }
);
