const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2; 


// 🔥 CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 MULTER (memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// 🔥 ROUTE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded ❌" });
    }

    const file = req.file;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ccbs" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    res.json({ url: result.secure_url });

  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large (Max 5MB)" });
    }
    console.error(err); // 🔥 ADD THIS
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;