import React from 'react';

export default function SignUpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px' }}>
        <h2>Sign Up / Login</h2>
        <p>Modal content goes here</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

