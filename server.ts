import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nourish Kids API" });
});

// AI Recipe & Meal Generator from Pantry Ingredients
app.post("/api/gemini/pantry-stretch", async (req, res) => {
  try {
    const { ingredients, ageGroup, constraints, dietaryNotes } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(400).json({ error: "Please select at least one ingredient." });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `
You are a warm, supportive, and practical nutrition and frugal meal planning expert helping a parent feed their child on a tight budget with minimal stress.

The parent has these ingredients available in their pantry/fridge: ${ingredients.join(", ")}.
Child Age Group: ${ageGroup || "All Ages"}
Preparation constraints/goals: ${constraints && constraints.length > 0 ? constraints.join(", ") : "Quick, affordable, kid-friendly"}.
Additional Notes: ${dietaryNotes || "None"}

Please generate 3 wholesome, highly realistic, low-cost, kid-approved recipe ideas that can be made using primarily these ingredients (and basic salt/water/oil if available).

Return your response ONLY as valid JSON (no markdown formatting, no tick marks) with the following structure:
{
  "recipes": [
    {
      "id": "generated-1",
      "title": "Creative Kid-Friendly Recipe Name",
      "prepTime": "10 mins",
      "cookTime": "15 mins",
      "estimatedCost": "$0.85 per serving",
      "ageSuitability": "1-3 yrs (cut into bites), 4-8 yrs",
      "description": "Short, encouraging summary of why kids like this and how it nourishes them.",
      "ingredientsUsed": ["Ingredient 1", "Ingredient 2"],
      "pantryAdditions": ["optional salt", "dash of cinnamon or oil"],
      "instructions": [
        "Step 1...",
        "Step 2...",
        "Step 3..."
      ],
      "kidHacks": "Tip on texture, presentation, or hiding veggies/protein if kid is picky.",
      "safetyNote": "Choking hazard or temperature tip if applicable for young kids.",
      "nutritionHighlight": "High in Protein & Fiber"
    }
  ],
  "encouragement": "A short 1-2 sentence warm note of encouragement for the parent."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in pantry-stretch route:", error);
    res.status(500).json({
      error: error.message || "Failed to generate recipes. Please try again.",
    });
  }
});

// AI Kitchen Companion Chat Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `
You are "Nourish AI", a compassionate, non-judgmental, ultra-practical kitchen assistant designed to help parents feed their babies, toddlers, and children under low budget, limited time, or food stress.

Your core guidelines:
1. Always be deeply respectful, kind, and encouraging. Never shame parents for using pantry staples, processed goods, food banks, or simple foods.
2. Prioritize practical solutions: budget stretch, texture modifications for toddlers (choking hazard safety), hidden nutrition, easy substitutions, and quick meal ideas.
3. If asked about WIC, SNAP, food pantries, or school lunch programs, offer clear, empowering guidance.
4. Keep answers concise, actionable, bulleted, and easy to read on a phone while holding a child.
`;

    const chatMessages = (history || []).map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    // Add current user prompt
    chatMessages.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatMessages,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || "I am here to help you find ideas to nourish your family." });
  } catch (error: any) {
    console.error("Error in chat route:", error);
    res.status(500).json({
      error: error.message || "Unable to answer right now. Please try again.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
