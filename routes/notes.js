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

      // * getting info from body by destructring
      const { title, description, tag } = req.body;

      // * creating a note
      let note = await Note.create({
        title,
        description,
        tag,
        user: req.user.id,
      });

      // * saving note
      const savedNote = await note.save();

      // * sending updated note
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      // req.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ! update an existing note
router.put("/updatenote/:id", getUser, async (req, res) => {
  try {
    // * getting errors if any
    const errors = validationResult(req);

    // * handling errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }

    // * getting info from body by destructring
    const { title, description, tag } = req.body;

    // * object to add updating params
    let updatedNote = {};

    // * appending new params if updated in the temp note
    if (title) updatedNote.title = title;
    if (description) updatedNote.description = description;
    if (tag) updatedNote.tag = tag;

    // * finding the right note
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // * authenticating user
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ error: "Unauthorized" });

    // * updating note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { new: true }
    );

    // * sending updated note
    res.json(note);
  } catch (error) {
    console.log(error);
    // req.status(500).json({ error: "Internal Server Error" });
  }
});

// ! delete an existing note
router.delete("/deletenote/:id", getUser, async (req, res) => {
  try {
    // * getting errors if any
    const errors = validationResult(req);

    // * handling errors
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }

    // * finding the right note
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // * authenticating user
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ error: "Unauthorized" });

    // * deleting note
    note = await Note.findByIdAndDelete(req.params.id);

    // * sending success message
    res.json({ Success: "Note Deleted", note });
  } catch (error) {
    console.log(error);
    // req.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
