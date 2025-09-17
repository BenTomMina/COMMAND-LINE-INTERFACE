import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import Auctions from "./models/auctions.js";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Connect Gemini
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Endpoint using Gemini to create query
app.get();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost${PORT}`));
