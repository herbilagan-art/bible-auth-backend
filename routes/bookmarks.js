const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "✅ Bookmarks route placeholder" });
});

module.exports = router;