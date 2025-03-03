import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const RELEVANCE_THRESHOLD = 65; // ✅ Set minimum score for relevance

export default async function handler(req, res) {
  try {
    console.log("🔵 API Request Received");

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    console.log("🟡 Generating Embedding for Job Description...");
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResponse = await model.embedContent({ content: { parts: [{ text: jobDescription }] } });

    if (!embeddingResponse.embedding) {
      return res.status(500).json({ error: "No embedding received" });
    }

    console.log("🟢 Searching for matching candidates in Pinecone...");
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    const queryResponse = await index.namespace("default").query({
      topK: 5,
      vector: embeddingResponse.embedding.values,
      includeMetadata: true,
    });

    if (!queryResponse.matches.length) {
      return res.status(200).json({ candidates: [] });
    }

    console.log("🧠 Sending Candidates to Gemini AI for Evaluation...");
    const candidatesWithAI = await Promise.all(
      queryResponse.matches.map(async (match) => {
        const metadata = match.metadata || {};

        try {
          const score = (match.score * 100).toFixed(2); // Scale to 100
          return { id: match.id, score, metadata: { ...metadata } };
        } catch {
          return { id: match.id, score: match.score * 100, metadata: { ...metadata } };
        }
      })
    );

    // ✅ Filter only candidates with score above threshold
    const filteredCandidates = candidatesWithAI.filter((candidate) => candidate.score >= RELEVANCE_THRESHOLD);

    console.log("🎯 Filtered AI-Enhanced Candidates:", filteredCandidates);
    res.status(200).json({ candidates: filteredCandidates });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
