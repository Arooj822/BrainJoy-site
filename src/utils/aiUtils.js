// src/utils/aiUtils.js

// Simulate AI-generated questions for testing
// In production, replace this with real API call to Gemini or OpenAI
const fetchAIQuestions = async (topic, subject, difficulty = "Medium") => {
  console.log("Fetching AI questions for:", topic, subject, difficulty);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate mock questions
  const sampleQuestions = [
    {
      text: `Explain the key concept of ${topic}.`,
      type: "ShortAnswer",
      correct: "Sample answer"
    },
    {
      text: `${topic}: Which of the following is correct?`,
      type: "MCQ",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 1
    },
    {
      text: `${topic}: True or False statement example.`,
      type: "TrueFalse",
      correct: true
    }
  ];

  // You can modify questions based on difficulty if needed
  if (difficulty === "Easy") {
    sampleQuestions.forEach(q => {
      if (q.type === "MCQ") q.options = q.options.slice(0, 2);
    });
  } else if (difficulty === "Hard") {
    sampleQuestions.push({
      text: `Advanced question on ${topic}`,
      type: "ShortAnswer",
      correct: "Advanced answer"
    });
  }

  return sampleQuestions;
};

export default fetchAIQuestions;

