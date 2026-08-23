// pages/api/generate-questions.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { topic, difficulty } = req.body;

  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  try {
    // Placeholder AI generation logic
    // Replace this with actual API call to Gemini or OpenAI
    const questions = [
      {
        type: 'MCQ',
        prompt: `What is the main principle of ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
        hint: `Think about the basic concept of ${topic}`,
        media: '',
      },
      {
        type: 'ShortAnswer',
        prompt: `Explain the key idea behind ${topic}.`,
        answer: '',
        hint: 'Provide a concise explanation.',
        media: '',
      }
    ];

    res.status(200).json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}
