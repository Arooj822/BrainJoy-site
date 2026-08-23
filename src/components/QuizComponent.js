// src/components/QuizComponent.js
import React, { useState, useEffect } from "react";
import HoloFeedback from "./HoloFeedback";
import fetchAIHint from "../utils/aiUtils";

const QuizComponent = ({ quiz, previewMode = false }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timer || 300);
  const [completed, setCompleted] = useState(false);
  const [shortAnswer, setShortAnswer] = useState("");
  const [hint, setHint] = useState(null);
  const [holoTrigger, setHoloTrigger] = useState(0);
  const [finishHoloTrigger, setFinishHoloTrigger] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [badges, setBadges] = useState([]);

  // Timer effect
  useEffect(() => {
    if (previewMode || completed) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCompleted(true);
          setTimeout(() => setFinishHoloTrigger(t => t + 1), 120);
          awardBadges();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completed, previewMode]);

  const handleAnswer = async (ans) => {
    if (previewMode) return;

    const q = quiz.questions[current];
    let correct = false;

    if (q.type === "MCQ" || q.type === "TrueFalse") {
      correct = ans === q.correct;
    } else if (q.type === "ShortAnswer") {
      correct = ans.trim().toLowerCase() === q.correct.trim().toLowerCase();
    }

    if (correct) setScore(prev => prev + 1);

    setAnswers([...answers, { questionId: q.id, answer: ans, correct }]);
    setHint(null);
    setHoloTrigger(prev => prev + 1);

    // If wrong and question text exists, fetch AI hint
    if (!correct && q.text) {
      const aiHint = await fetchAIHint(q.text, quiz.subject);
      setHint(aiHint);
    }

    // Move to next question after short delay
    setTimeout(() => {
      if (current < quiz.questions.length - 1) {
        setCurrent(prev => prev + 1);
        setShortAnswer("");
        setHint(null);
      } else {
        setCompleted(true);
        awardBadges();
        setTimeout(() => setFinishHoloTrigger(t => t + 1), 120);
      }
    }, 1200);
  };

  // Award badges based on performance
  const awardBadges = () => {
    const newBadges = [];
    const percent = (score / quiz.questions.length) * 100;
    if (percent === 100) newBadges.push("Quiz Master 🏆");
    if (timeLeft > quiz.timer / 2) newBadges.push("Quick Thinker ⚡");
    if (quiz.questions.length >= 5 && percent >= 80) newBadges.push("High Achiever 🎯");
    setBadges(newBadges);
  };

  // Retry only incorrect questions
  const retryIncorrect = () => {
    const incorrectQuestions = quiz.questions.filter(q => {
      const ans = answers.find(a => a.questionId === q.id);
      return !ans?.correct;
    });

    if (incorrectQuestions.length === 0) return alert("All answers correct! 🎉");

    setCurrent(0);
    setAnswers([]);
    setScore(0);
    setCompleted(false);
    setReviewMode(true);
  };

  // Questions for review mode
  const questionsToDisplay = reviewMode
    ? quiz.questions.filter(q => {
        const ans = answers.find(a => a.questionId === q.id);
        return !ans?.correct;
      })
    : quiz.questions;

  // Completed / preview view
  if (completed || previewMode) {
    return (
      <div style={{ padding: 20 }}>
        <h2>{quiz.title} - {quiz.subject}</h2>
        {!previewMode && <h3>Quiz Completed!</h3>}
        {!previewMode && <p>Score: {score} / {quiz.questions.length}</p>}

        {/* Progress bar */}
        {!previewMode && (
          <div style={{ background: "#eee", borderRadius: 6, height: 20, margin: "10px 0" }}>
            <div
              style={{
                width: `${(score / quiz.questions.length) * 100}%`,
                background: "#4caf50",
                height: "100%",
                borderRadius: 6,
                transition: "width 0.6s"
              }}
            />
          </div>
        )}

        {/* Badges */}
        {!previewMode && badges.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {badges.map((b, i) => (
              <span key={i} style={{ marginRight: 10, fontWeight: "bold" }}>{b}</span>
            ))}
          </div>
        )}

        <ul>
          {questionsToDisplay.map(q => {
            const a = answers.find(ans => ans.questionId === q.id);
            return (
              <li key={q.id} style={{ margin: "8px 0" }}>
                <strong>Q:</strong> {q.text} <br />
                {a && !previewMode && (
                  <>
                    <strong>Your:</strong> {a.answer} <br />
                    <strong>Result:</strong> {a.correct ? "✅ Correct" : `❌ Correct: ${q.correct}`} <br />
                    {!a.correct && q.text && <em>AI Hint: {fetchAIHint(q.text, quiz.subject)}</em>}
                  </>
                )}
                {previewMode && (
                  <div>
                    <strong>Correct:</strong> {q.type === "MCQ" ? q.options[q.correct] : q.correct.toString()}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {!previewMode && !reviewMode && (
          <button onClick={retryIncorrect} style={{ marginTop: 12, padding: "6px 12px" }}>
            Retry Incorrect Questions
          </button>
        )}

        {!previewMode && (
          <div style={{ marginTop: 12 }}>
            <HoloFeedback trigger={finishHoloTrigger} size={260} duration={1500} />
          </div>
        )}
      </div>
    );
  }

  // Active question view
  const q = questionsToDisplay[current];

  return (
    <div style={{ padding: 20 }}>
      <h2>{quiz.title} - {quiz.subject}</h2>
      {!previewMode && <p><strong>Time Left:</strong> {timeLeft}s</p>}
      <p><strong>Question {current + 1}:</strong> {q.text}</p>

      {q.mediaUrl && <img src={q.mediaUrl} alt="Media" style={{ maxWidth: 420, margin: "10px 0" }} />}

      {q.type === "MCQ" && q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(i)}
          style={{ display: "block", margin: "6px 0", padding: "8px 12px" }}
        >
          {opt}
        </button>
      ))}

      {q.type === "TrueFalse" && (
        <>
          <button onClick={() => handleAnswer(true)} style={{ marginRight: 10, padding: "6px 10px" }}>True</button>
          <button onClick={() => handleAnswer(false)} style={{ padding: "6px 10px" }}>False</button>
        </>
      )}

      {q.type === "ShortAnswer" && (
        <>
          <input
            type="text"
            placeholder="Your Answer"
            value={shortAnswer}
            onChange={e => setShortAnswer(e.target.value)}
            style={{ display: "block", marginBottom: 8, padding: 6, width: "100%", maxWidth: 520 }}
          />
          <button onClick={() => handleAnswer(shortAnswer)} style={{ padding: "8px 12px" }}>Submit</button>
        </>
      )}

      {hint && <p style={{ fontStyle: "italic", color: "#0b6", marginTop: 8 }}>Hint: {hint}</p>}

      {!previewMode && (
        <div style={{ position: "relative", height: 0 }}>
          <div style={{ position: "absolute", right: 0, top: -10 }}>
            <HoloFeedback trigger={holoTrigger} size={180} duration={1000} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;

