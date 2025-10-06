const express = require("express");
const authenticateToken = require("../middleware/auth-middleware");
const Note = require("../models/note");

const router = express.Router();

// GET /notes → fetch notes for user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json({ message: "✅ Notes fetched", notes });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch notes", error: err.message });
  }
});

// POST /notes/sync → save or update a note
router.post("/sync", authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "❌ Note content is required" });

  try {
    const note = new Note({ userId: req.user.id, content });
    await note.save();
    res.json({ message: "✅ Note synced", note });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to sync note", error: err.message });
  }
});

module.exports = router;