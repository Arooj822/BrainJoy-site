import React from 'react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  return (
    <div>
      <h1>Welcome, Teacher!</h1>
      <Link to="/quiz-builder">
        <button>Create a New Quiz</button>
      </Link>
    </div>
  );
};

export default TeacherDashboard;

