// ---------- GPT API ---------- //
// npm run gpt

import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "512kb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, "public");
app.use(express.static(PUBLIC_DIR));

app.get("/", (_req, res) => {
  res.sendFile(join(PUBLIC_DIR, "index.html"));
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/submit")) return next();
  res.sendFile(join(PUBLIC_DIR, "index.html"));
});

const openai = new OpenAI({
  apiKey: process.env.GPTAPIKEY,
});

app.post("/submit", async (req, res) => {
  const { input, model, temperature, top_p } = req.body || {};
  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Missing 'input' string." });
  }

  try {
    const ai = await getGptResultAsString({
      input,
      model: model || "gpt-4.1",
      temperature: Number.isFinite(temperature) ? temperature : 0.7,
      top_p: Number.isFinite(top_p) ? top_p : 0.9,
    });
    res.json({ ai });
  } catch (error) {
    console.error("Error:", error?.message || error);
    res
      .status(500)
      .json({ error: "Failed to generate output. Please try again." });
  }
});

async function getGptResultAsString({ input, model, temperature, top_p }) {
  console.log("--Run GPT", { model, temperature, top_p });

  const completion = await openai.chat.completions.create({
    model,
    temperature,
    top_p,
    messages: [
      {
        role: "system",
        content:
          "You are Eva in a lateral-thinking puzzle. ALWAYS reply in exactly two lines: " +
          'first line strictly one of: "yes." | "no." | "doesn\'t relate." | "that\'s correct!", ' +
          "second line a very short (≤15 words) playful, slightly eerie nudge. No emojis. Never restate the puzzle or reveal the answer unless correct.",
      },
      { role: "user", content: input },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || "No response.";
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ---------- GPT API ---------- //
