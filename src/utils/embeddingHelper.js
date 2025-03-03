import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getEmbedding(text) {
  try {
    console.log("🧠 Getting Embeddings...");
    console.log("📝 Resume Text (First 500 chars):", text.substring(0, 500));

    // ✅ Use the correct model name
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    const result = await model.embedContent({
      content: { parts: [{ text: text }] }, // ✅ Correct JSON structure
    });

    console.log("🔍 API Response:", result);
    if (!result.embedding) throw new Error("No embedding received");

    return result.embedding;
  } catch (error) {
    console.error("❌ Google AI Error:", error);
    return null;
  }
}
