import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import OpenAI from 'openai';

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
    const gptResponse = await getGptResultAsString(input);
    res.json({ gpt: gptResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate output. Please try again.' });
  }
});

async function getGptResultAsString(input) {
  const openai = new OpenAI({
    apiKey: process.env.GPTAPIKEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: input
        }
      ],
      model: 'gpt-4-1106-preview',
    });

    return completion.choices[0]?.message?.content || 'No response received from GPT-3.';
  } catch (error) {
    console.error('GPT-3 Error:', error);
    throw error; 
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// npm run develop




