// Importing necessary modules
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import OpenAI from 'openai';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Submit endpoint
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

// Function to get GPT-3 result
async function getGptResultAsString(input) {
  const openai = new OpenAI({
    apiKey: process.env.GPTAPIKEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: input // Ensure dynamic input is used here
        }
      ],
      model: 'gpt-3.5-turbo-1106',
    });

    return completion.choices[0]?.message?.content || 'No response received from GPT-3.';
  } catch (error) {
    console.error('GPT-3 Error:', error);
    throw error; // Rethrow the error to be caught in the endpoint
  }
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
