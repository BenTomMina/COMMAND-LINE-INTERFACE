import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import Auctions from "./models/auctions.js";
import { GoogleGenAI } from "@google/genai";

const app = express();
// app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Connect Gemini
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Endpoint using Gemini to create query
app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Query param 'q' is required" });

  // System instructions to return only valid JSON
  const prompt = `
    You are an assistant that converts natural language into MongoDB query objects.
    The collection is "auctions" with the following fields available for search:
        - title (string)
        - description (string)

    Rules:
        - ONLY search using 'title' and 'description'
        - Always return a single valid JSON object with a case-insensitive $regex match.
        - Do NOT use other fields like start_price and reserve_price.
        - Example for "find vintage guitar":
            {
            "$or": [
                    {"title": {"$regex": "guitar", "$options": "i"}},
                    {"description"}: {"$regex": "guitar", "$options": "i"}}
                ]
            }
    `;

  try {
    const contents = [{ role: "user", parts: [{ text: q }] }];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction: prompt },
    });

    const candidate = response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const text = part?.text;

    if (!text) {
      return res
        .status(500)
        .json({ error: "Invalid response from Gemini API" });
    }

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const mongoQuery = JSON.parse(cleanedText);

    // Enforce only title/descriptions allowed
    const allowedFields = ["title", "description", "$or", "$regex", "$options"];
    const jsonStr = JSON.stringify(mongoQuery);

    for (const key of Object.keys(JSON.parse(jsonStr))) {
      if (!allowedFields.includes(key) && !Array.isArray(mongoQuery[key])) {
        throw new Error("Invalid field in query");
      }
    }

    const results = await Auctions.find(mongoQuery);
    res.json({ query: mongoQuery, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost${PORT}`));
