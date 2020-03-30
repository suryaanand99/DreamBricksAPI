const mongoose = require("mongoose");
const {DB_URI} = process.env; 

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log("db connected!!");
  })
  .catch(err => {
    console.log(err);
  });
