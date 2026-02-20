const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });