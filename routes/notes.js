const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Notes Working");
});

module.exports = router;
