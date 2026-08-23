// src/components/HeroSection.js
import React, { useState } from 'react';
import SignUpModal from './SignUpModal';

export default function HeroSection({ isSignUpOpen, setIsSignUpOpen }) {
  // Local state fallback if props are not passed
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const finalIsOpen = isSignUpOpen !== undefined ? isSignUpOpen : localIsOpen;
  const finalSetOpen = setIsSignUpOpen !== undefined ? setIsSignUpOpen : setLocalIsOpen;

  return (
    <section
      style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: '#f0f8ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Hero Section"
    >
      <h1 style={{ fontSize: '3rem', color: '#1a365d', marginBottom: '20px' }}>
        Welcome to BrainJoy Elite!
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '40px', maxWidth: '600px' }}>
        Learn, Quiz, and Level Up Your Skills
      </p>
      <button
        onClick={() => finalSetOpen(true)}
        style={{
          padding: '12px 30px',
          fontSize: '1.2rem',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: '#a0e7e5',
          color: '#000',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'transform 0.3s, background-color 0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Get Started
      </button>

      {/* SignUp Modal */}
      <SignUpModal isOpen={finalIsOpen} onClose={() => finalSetOpen(false)} />
    </section>
  );
}


