// NODE.JS

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001
const __filename = fileURLToPath(import.meta.url); //go to this url and serve that
const __dirname = dirname(__filename);

app.use(bodyParser.json());

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {

  // console.log(req.body)
  let input = req.body.input

  let gptResponse = 'failed to generate output.. Please try again..'

  console.log("--GPT info sending...")
  async function getGptResultAsString(input) {
    try {
      const result = await gpt(input);
      return JSON.stringify(result);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getGptResultAsString(input).then(response => {
    gptResponse = response
    console.log(`--GPT promise processed`)
  });

  setTimeout(async () => {
    console.log(`--RIGHT BEFORE respnose json`)
    const response = {
      gpt: `${gptResponse}`
    }
    res.json(response)
  }, 5000);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //
// ----------GPT ---------- //

const openai = new OpenAI({
  apiKey: process.env.GPTAPIKEY, //api key
});

async function gpt(input) {
  console.log("--GPT info received...")
  // Non-streaming:
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `please say this is a test`
      }
    ],
    model: 'gpt-3.5-turbo-1106',
    // response_format: { type: "json_object" },
  });
  console.log("--GPT Result:")
  // console.log(completion.choices[0]?.message?.content);
  let gptResult = completion.choices[0]?.message?.content
  console.log(gptResult)
  return gptResult
}

