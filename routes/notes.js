router.post("/sync", authenticateToken, async (req, res) => {
  const { content } = req.body;
  console.log("🔍 Incoming note content:", content);
  console.log("🔍 Authenticated user:", req.user);

  if (!content) {
    console.warn("⚠️ Missing note content");
    return res.status(400).json({ message: "❌ Note content is required" });
  }

  try {
    const note = new Note({ userId: req.user.id, content });
    await note.save();
    console.log("✅ Note saved:", note);
    res.json({ message: "✅ Note synced", note });
  } catch (err) {
    console.error("❌ Error syncing note:", err);
    res.status(500).json({ message: "❌ Failed to sync note", error: err.message });
  }
});