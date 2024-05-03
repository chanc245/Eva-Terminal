// ---------- GEMINI API ---------- //
// npm run gemini

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai"

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
  let input = req.body.input;

  try {
    const aiResponse = await getGenResultAsString(input);
    res.json({ ai: aiResponse });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to generate output. Please try again.' });
  }
});

async function getGenResultAsString(input) {
  console.log(`--User input: [${input}]` );
  console.log("--Gemini Request Sent");
  
  const genAI = new GoogleGenerativeAI(process.env.GOOGLEAPIKEY);

  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest"});
  //gemini-1.5-pro-latest -> better than gemini-pro but too easy to exhaust 
  const model = genAI.getGenerativeModel({ model: "gemini-pro"}); 

  const prompt = input;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(`==Gemini Output: [${text}]`);

  return text;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ---------- GEMINI API ---------- //
// ---------- GEMINI API ---------- //
// ---------- GEMINI API ---------- //
// ---------- GEMINI API ---------- //
// ---------- GEMINI API ---------- //
