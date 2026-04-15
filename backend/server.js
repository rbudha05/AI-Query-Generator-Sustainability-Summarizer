import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import natural from "natural";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";

dotenv.config();

console.log("API KEY:", process.env.GOOGLE_API_KEY);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing from .env file");
}

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const tokenizer = new natural.WordTokenizer();

async function loadDocuments() {
  const loader = new TextLoader("./data/info.txt");
  const docs = await loader.load();
  return docs;
}

async function retrieveData(query, documents) {
  const queryTokens = tokenizer.tokenize(query.toLowerCase());
  let bestMatch = null;
  let highestScore = 0;

  documents.forEach((document) => {
    if (!document || !document.pageContent) return;

    const sentences = document.pageContent
      .split(/[\r\n]+/)
      .filter((line) => line.trim() !== "");

    sentences.forEach((sentence) => {
      const sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
      const intersection = sentenceTokens.filter((token) =>
        queryTokens.includes(token)
      );
      const score = intersection.length;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = sentence;
      }
    });
  });

  console.log("Best match:", bestMatch);
  return bestMatch || "No relevant information found.";
}

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/query", async (req, res) => {
  const { query } = req.body;
  console.log("Received query:", query);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const documents = await loadDocuments();
    const retrievedData = await retrieveData(query, documents);

    const augmentedQuery = retrievedData
      ? `${query} Considering the following fact: ${retrievedData}`
      : query;

    console.log("Augmented query:", augmentedQuery);

    const response = await model.invoke([["human", augmentedQuery]]);
    console.log("Generated response:", response.content);

    res.json({ response: response?.content || "No response generated." });
  } catch (error) {
    console.error("FULL BACKEND ERROR:", error);
    res.status(500).json({
      error: "An error occurred while processing the request.",
      details: error.message,
    });
  }
});

app.post("/api/summarize", async (req, res) => {
  const { articleTitle, articleText } = req.body;

  console.log("Received article for summarization");

  if (!articleText || !articleText.trim()) {
    return res.status(400).json({ error: "Article text is required" });
  }

  try {
    const prompt = `
You are a university student assistant working on a sustainability assignment.

Task:
Analyze the following article and provide:

Summary:
Write one clear paragraph summarizing the article.

Analysis:
Write one paragraph explaining the importance of the article in terms of sustainability, environmental impact, and responsibility of tech companies.

Key Points:
- Point 1
- Point 2
- Point 3

Instructions:
- Use simple and clear language
- Focus on AI, cloud computing, sustainability, carbon emissions, renewable energy, or data centers if mentioned
- Do NOT make up facts
- Keep the structure exactly as shown
- Mention the company name if the article is about Microsoft, Google, Amazon, Meta, or another technology company

Article Title:
${articleTitle || "Untitled"}

Article Content:
${articleText}
`;

    const response = await model.invoke([["human", prompt]]);
    console.log("Summary generated:", response.content);

    res.json({
      result: response?.content || "No summary generated.",
    });
  } catch (error) {
    console.error("Summarizer error:", error);
    res.status(500).json({
      error: "Failed to generate summary.",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});