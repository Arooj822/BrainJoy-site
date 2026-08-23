import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const QuizBuilderPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleSaveQuiz = async () => {
    const user = supabase.auth.getUser().then(({ data }) => data.user);
    const { error } = await supabase.from('quizzes').insert([
      { title, subject, questions, created_by: user.id }
    ]);
    if (!error) alert('Quiz saved!');
    else alert(error.message);
  };

  return (
    <div>
      <h1>Quiz Builder</h1>
      <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <button onClick={handleSaveQuiz}>Save Quiz</button>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default QuizBuilderPage;
