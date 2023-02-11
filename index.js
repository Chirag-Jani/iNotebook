// * getting express
const express = require("express");

// * to connect to mongodb
const connectMongo = require("./db");

const app = express();
const port = 5000;

// * to use json
app.use(express.json());

// * getting routes
app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));

// * server shit
app.listen(port, (err) => {
  if (err) console.error("Error encountered: ", err);
  console.log(`Server running on port: ${port}`);
});

// * finally connecting to mongo
connectMongo();
