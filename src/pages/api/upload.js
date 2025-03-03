import pinecone from "@/utils/pineconeClient";
import { getEmbedding } from "@/utils/embeddingHelper";
import multer from "multer";
import pdfParse from "pdf-parse";
import fs from "fs";
import { promisify } from "util";

const upload = multer({ dest: "public/uploads/" });
export const config = { api: { bodyParser: false } };
const uploadMiddleware = promisify(upload.single("resume"));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.error("❌ Method Not Allowed:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("📂 Uploading File...");
    await uploadMiddleware(req, res);

    if (!req.file) {
      console.error("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("📄 File Uploaded:", filePath);

    // ✅ Extract form data from request
    const { name, email, skills, experience, linkedin } = req.body;
    console.log("📝 Candidate Details:", { name, email, skills, experience, linkedin });

    // ✅ Extract text from PDF
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    let extractedText = pdfData.text;

    // ✅ Clean the extracted text
    extractedText = extractedText
      .replace(/\n+/g, "\n") // Preserve newlines for structure
      .replace(/\s{2,}/g, " ") // Remove extra spaces
      .trim();

    console.log("📄 Extracted & Cleaned Text (First 500 chars):", extractedText.substring(0, 500));

    fs.unlinkSync(filePath); // Delete file after processing

    // ✅ Convert text to embedding
    console.log("🧠 Getting Embeddings...");
    const embedding = await getEmbedding(extractedText);

    if (!embedding) {
      console.error("❌ Failed to generate embedding");
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    console.log("📥 Storing in Pinecone...");
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

    // ✅ Store extracted candidate details in Pinecone
    await index.namespace("default").upsert([
      {
        id: req.file.filename,
        values: embedding.values,
        metadata: {
          name: name || "Unknown",
          skills: skills || "Not Provided",
          email: email||"Not Provided",
          experience: experience || "Not Provided",
          linkedin: linkedin || "Not Provided",
          uploadedBy: "Swapnamoy"
        }
      }
    ]);

    console.log("✅ Upload & Processing Complete!");
    res.status(200).json({ success: true, text: extractedText });
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
