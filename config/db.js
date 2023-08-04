const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
mongoose.set("strictQuery", true);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });
