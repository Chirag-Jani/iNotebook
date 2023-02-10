// * getting express
const express = require("express");

// * to use router - not sure about this
const router = express.Router();

// * home url (originally used '/notes' in the index file but will serve '/' location)
router.get("/", (req, res) => {
  res.send("Notes Working");
});

module.exports = router;
