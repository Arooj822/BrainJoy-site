// pages/api/save-quiz.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // must have insert privileges
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, subject, questions } = req.body;

  if (!title || !subject || !questions || !questions.length) {
    return res.status(400).json({ error: 'Title, subject, and questions are required' });
  }

  try {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([
        {
          title,
          subject,
          questions,
          created_by: req.headers['x-user-id'], // pass user id from frontend auth
        }
      ]);

    if (error) throw error;

    res.status(200).json({ message: 'Quiz saved successfully', quiz: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save quiz' });
  }
}
