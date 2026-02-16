import express, { Express, Request, Response } from "express";
import multer from "multer";
import { supabase } from "./lib/supabase.js";
import { requireAdmin } from "./authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only images are allowed."));
  },
});

router.post("/upload", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
  try {
    // ✅ Handle YouTube or external link uploads
    if (req.body.url) {
      const url = req.body.url.trim();
      let thumbnail = null;

      // If YouTube link, extract thumbnail
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) {
        const videoId = ytMatch[1];
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

      return res.status(200).json({
        type: ytMatch ? "youtube" : "external",
        url,
        thumbnail,
        message: "External media link stored successfully",
      });
    }

    // ✅ Handle file uploads
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!supabase) {
      return res.status(503).json({ 
        error: "File upload service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables." 
      });
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    const filepath = `uploads/${filename}`;

    const { data, error } = await supabase.storage
      .from("nrsa-uploads")
      .upload(filepath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return res.status(500).json({ error: error.message });
    }

    const { data: publicData } = supabase.storage
      .from("nrsa-uploads")
      .getPublicUrl(data.path);

    res.status(200).json({
      type: "image",
      url: publicData.publicUrl,
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export function registerUploadRoutes(app: Express) {
  app.use("/api", router);
}