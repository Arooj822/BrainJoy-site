// pages/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.user();
      if (!user) return navigate('/login');

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {profile.full_name} ({profile.role})</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;

