const express = require("express");
const authenticateToken = require("../middleware/auth-middleware");
const Note = require("../models/note");

const router = express.Router();

// GET /notes → fetch notes for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  console.log("📥 GET /notes for user:", req.user?.id);

  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    console.log("✅ Notes fetched:", notes.length);
    res.json({ message: "✅ Notes fetched", notes });
  } catch (err) {
    console.error("❌ Failed to fetch notes:", err);
    res.status(500).json({ message: "❌ Failed to fetch notes", error: err.message });
  }
});

// POST /notes/sync → create a new note for authenticated user
router.post("/sync", authenticateToken, async (req, res) => {
  const { content } = req.body;
  console.log("📥 POST /notes/sync with content:", content);
  console.log("🔐 Authenticated user:", req.user);

  if (!content) {
    console.warn("⚠️ Missing note content");
    return res.status(400).json({ message: "❌ Note content is required" });
  }

  try {
    const note = new Note({
      userId: req.user.id,
      content
    });

    await note.save();
    console.log("✅ Note saved:", note._id);
    res.json({ message: "✅ Note synced", note });
  } catch (err) {
    console.error("❌ Error syncing note:", err);
    res.status(500).json({ message: "❌ Failed to sync note", error: err.message });
  }
});

module.exports = router;