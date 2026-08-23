import React from 'react';

export default function RoleSelection({ onSelect }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Select Your Role</h2>
      <button onClick={() => onSelect('student')}>Student</button>
      <button onClick={() => onSelect('teacher')}>Teacher</button>
      <button onClick={() => onSelect('parent')}>Parent</button>
      <button onClick={() => onSelect('admin')}>Admin</button>
    </div>
  );
}
