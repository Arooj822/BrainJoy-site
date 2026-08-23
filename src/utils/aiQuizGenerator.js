import axios from "axios";

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // Replace with your API key

/**
 * Generate a full quiz from a topic.
 * @param {string} topic - e.g., "Newton's Laws"
 * @param {string} subject - e.g., "Physics"
 * @param {string} curriculum - e.g., "IB DP"
 * @param {string} difficulty - "Easy", "Medium", "Hard"
 * @param {number} numQuestions - number of questions to generate
 */
export const generateQuiz = async (topic, subject, curriculum, difficulty = "Medium", numQuestions = 5) => {
  try {
    const prompt = `
      Create ${numQuestions} ${difficulty} questions for a ${curriculum} ${subject} quiz on the topic: "${topic}".
      Each question should include:
      - type: MCQ, TrueFalse, or ShortAnswer
      - text: the question
      - options: for MCQ only, array of 3-5 choices
      - correct: index of correct option for MCQ or boolean for TrueFalse, or text for ShortAnswer
      - hint: short hint for students
    Return as JSON array.
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    // Parse AI response safely
    const quizData = JSON.parse(content);
    return quizData;
  } catch (err) {
    console.error("AI Quiz Generation Error:", err);
    return [];
  }
};
