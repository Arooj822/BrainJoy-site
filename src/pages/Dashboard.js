import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/login');
      else setUser(data.session.user);
    });
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={() => navigate('/quiz-builder')}>Go to Quiz Builder</button>
    </div>
  );
};

export default Dashboard;
