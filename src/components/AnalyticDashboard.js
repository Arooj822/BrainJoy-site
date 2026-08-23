// src/components/AnalyticsDashboard.js
import React, { useMemo } from "react";

// Props: quizzes = [{ id, title, subject, questions: [{id, text, correct}], answers: [{questionId, correct, timeTaken, subject}] }]
const AnalyticsDashboard = ({ quizzes }) => {

  // Flatten all answers across quizzes
  const allAnswers = useMemo(() => {
    return quizzes.flatMap(qz => qz.answers || []);
  }, [quizzes]);

  // Learning Gap Analysis
  const learningGap = useMemo(() => {
    const bySubject = {};
    allAnswers.forEach(a => {
      const subj = a.subject || "General";
      if (!bySubject[subj]) bySubject[subj] = { correct: 0, total: 0 };
      bySubject[subj].total += 1;
      if (a.correct) bySubject[subj].correct += 1;
    });

    const result = [];
    for (const subj in bySubject) {
      const { correct, total } = bySubject[subj];
      result.push({
        subject: subj,
        correct,
        total,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      });
    }
    return result;
  }, [allAnswers]);

  // Question Efficacy
  const questionEfficacy = useMemo(() => {
    const byQuestion = {};
    allAnswers.forEach(a => {
      const qId = a.questionId;
      if (!byQuestion[qId]) byQuestion[qId] = { correct: 0, total: 0, text: a.text };
      byQuestion[qId].total += 1;
      if (a.correct) byQuestion[qId].correct += 1;
    });

    const efficacy = Object.values(byQuestion)
      .map(q => ({
        text: q.text,
        total: q.total,
        correct: q.correct,
        percent: q.total > 0 ? Math.round((q.correct / q.total) * 100) : 0,
      }))
      .sort((a, b) => a.percent - b.percent); // lowest correct first
    return efficacy;
  }, [allAnswers]);

  // Time-on-Question Metrics
  const timeMetrics = useMemo(() => {
    const byQuestion = {};
    allAnswers.forEach(a => {
      const qId = a.questionId;
      if (!byQuestion[qId]) byQuestion[qId] = { totalTime: 0, count: 0, text: a.text };
      byQuestion[qId].totalTime += a.timeTaken || 0;
      byQuestion[qId].count += 1;
    });

    return Object.values(byQuestion)
      .map(q => ({
        text: q.text,
        averageTime: q.count > 0 ? Math.round(q.totalTime / q.count) : 0,
      }))
      .sort((a, b) => b.averageTime - a.averageTime); // longest time first
  }, [allAnswers]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Analytics Dashboard</h2>

      <section style={{ marginBottom: 20 }}>
        <h3>Learning Gap Analysis (by Subject)</h3>
        <ul>
          {learningGap.map(s => (
            <li key={s.subject}>
              {s.subject}: {s.percent}% correct ({s.correct}/{s.total})
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Question Efficacy (Lowest Correct First)</h3>
        <ol>
          {questionEfficacy.map((q, idx) => (
            <li key={idx}>
              {q.text} - {q.percent}% correct ({q.correct}/{q.total})
            </li>
          ))}
        </ol>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Time-on-Question (Longest Average First)</h3>
        <ol>
          {timeMetrics.map((q, idx) => (
            <li key={idx}>
              {q.text} - Avg Time: {q.averageTime}s
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;


