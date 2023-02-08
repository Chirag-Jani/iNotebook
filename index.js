const express = require("express");
const connectMongo = require("./db");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/auth/login", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));

app.listen(port, (err) => {
  if (err) console.error("Error encountered: ", err);
  console.log(`Server running on port: ${port}`);
});

connectMongo();
