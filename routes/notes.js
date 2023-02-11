// * getting express
const express = require("express");
const { body, validationResult } = require("express-validator");
const getUser = require("../middleware/getUser");

// * getting notes schema
const Note = require("../models/Note");

// * to use router - not sure about this
const router = express.Router();

// ! home url (originally used '/notes' in the index file but will serve '/' location)
router.get("/mynotes", getUser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// ! to create notes
router.post(
  "/addnote",
  getUser,
  [
    body("title", "Title should be of minimum 3 characters").isLength({
      min: 3,
    }),
    body(
      "description",
      "Description should be of minimum 5 characters"
    ).isLength({ min: 5 }),
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

      const { title, description, tag } = req.body;

      // * creating a note
      let note = await Note.create({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error);
      // req.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
