import express from "express";
import multer from "multer";
import cors from "cors";
import Tesseract from "tesseract.js";
import path from "path";

const __dirname = process.cwd();

const app = express();
app.use(cors());

// multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// serve uploaded files statically for previews/downloads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// OCR route
app.post("/ocr-upload", upload.single("receipt"), async (req, res) => {
  try {
    const { path } = req.file;

    console.log("Processing:", path);

    // run OCR
    const result = await Tesseract.recognize(path, "eng");

    res.json({
      text: result.data.text,
    });
  } catch (error) {
    console.error("OCR error:", error);
    res.status(500).json({ error: "OCR failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
