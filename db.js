const mongoose = require("mongoose");

const mongoUri = "mongodb://localhost:27017/";
mongoose.set("strictQuery", false);

const connectMongo = async () => {
  mongoose.connect(mongoUri, () => {
    console.log("MongoDB connected!");
  });
};

module.exports = connectMongo;
