// * getting express
const express = require("express");

// * getting user's schema to make query requests
const User = require("../models/User");

// * to do validations
const { body, validationResult } = require("express-validator");

// * to use router - not sure about this
const router = express.Router();

// * to store data in data base (original query used in index.js is "/auth/register")
router.post(
  "/",
  [
    body("name", "Min length 3").isLength({ min: 3 }),
    body("email", "Email not valid").isEmail(),
    body("password", "Min length 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      // * getting errors if any
      const errors = validationResult(req);

      // * handling errors
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array(),
        });
      }

      // * finding user with the mail
      let user = await User.findOne({ email: req.body.email });

      // * checking for error
      if (user) {
        return res
          .status(400)
          .json({ error: "User with the same email exists" });
      }

      // * creting new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      res.json(user);
    } catch (err) {
      (err) => console.log(err);
      res.status(500).send("Error occured");
    }
  }
);

// * exporting to use in other files
module.exports = router;
