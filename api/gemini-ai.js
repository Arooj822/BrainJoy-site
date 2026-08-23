import fetch from "node-fetch";

export default async (req, res) => {
  const { text } = await req.json();
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }]
      })
    }
  );

  const data = await response.json();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text }));
};
