// * getting express
const express = require("express");

// * to encrypt password
const bcrypt = require("bcryptjs");

// * getting user's schema to make query requests
const User = require("../models/User");

// * to do validations
const { body, validationResult } = require("express-validator");

// * for token
const jwt = require("jsonwebtoken");

const JWT_SECRET = "chiragJaniSecret01";

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

      // ! securing the password

      // * generating salt
      const salt = await bcrypt.genSalt(10);
      let securePass = await bcrypt.hash(req.body.password, salt);

      // * creting new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      // * creating token and sending
      const data = {
        user: {
          id: user.id,
        },
      };
      let authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
      // res.json(user);
    } catch (err) {
      (err) => console.log(err);
      res.status(500).json({ error: "Error occured" });
    }
  }
);

// * exporting to use in other files
module.exports = router;
