import React from 'react';

export default function FeaturedCards() {
  const cards = [
    { title: 'Interactive Courses', desc: 'Learn with fun, engaging lessons.' },
    { title: 'Quizzes & Challenges', desc: 'Test your knowledge instantly.' },
    { title: 'Achievements', desc: 'Track your progress and earn badges.' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '50px 20px' }}>
      {cards.map((card, index) => (
        <div key={index} style={{
          background: '#a0e7e5',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          width: '250px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h3>{card.title}</h3>
          <p>{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
