const mongoose = require("mongoose");

// * url of the database - currnetly using locally
const mongoUri = "mongodb://localhost:27017/iNotebook";

// * to connect and avoid some error - not sure what it is, got fromm stackoverflow
mongoose.set("strictQuery", false);

// * function to connect to mongodb
const connectMongo = async () => {
  mongoose.connect(mongoUri, () => {
    console.log("MongoDB connected!");
  });
};

// * exporting to use in index.js file and other location if needed
module.exports = connectMongo;
