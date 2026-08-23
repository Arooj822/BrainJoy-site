import React from 'react';
import Logo from '../assets/Logo.png';

export default function NavBar({ setIsSignUpOpen }) {
  return (
    <nav style={{
      padding: '20px 50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#a0e7e5'
    }}>
      <div>
        <img src={Logo} alt="BrainJoy Elite Logo" style={{ height: '50px' }} />
      </div>
      <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#" onClick={() => setIsSignUpOpen(true)}>Login</a>
        <a href="#" onClick={() => setIsSignUpOpen(true)}>Sign Up</a>
      </div>
    </nav>
  );
}
