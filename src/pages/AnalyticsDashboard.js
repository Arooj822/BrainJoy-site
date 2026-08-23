import React from "react";

// Example analytics data
const studentData = [
  { name: "Alice", score: 2, avgTime: 45, hardQuestions: [2] },
  { name: "Bob", score: 3, avgTime: 30, hardQuestions: [] }
];

const AnalyticsDashboard = () => {
  return (
    <div>
      <h1>Class Analytics</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
            <th>Avg Time (s)</th>
            <th>Hard Questions</th>
          </tr>
        </thead>
        <tbody>
          {studentData.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.score}</td>
              <td>{s.avgTime}</td>
              <td>{s.hardQuestions.join(", ") || "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsDashboard;
