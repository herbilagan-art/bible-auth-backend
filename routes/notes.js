const express = require("express");
const authenticateToken = require("../middleware/auth-middleware");

const router = express.Router();

// GET /notes → protected route
router.get("/", authenticateToken, (req, res) => {
  res.json({
    message: "✅ Notes synced for user",
    userId: req.user.id
  });
});

module.exports = router;