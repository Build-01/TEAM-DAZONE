import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [selectedRole, setSelectedRole] = useState('worker');
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setTimeout(() => {
      // Passing the role to the next page so the app "remembers"
      navigate('/register', { state: { role } });
    }, 200);
  };

  const getButtonStyle = (role) => ({
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
    backgroundColor: selectedRole === role ? 'var(--primary-green)' : 'white',
    color: selectedRole === role ? 'white' : 'var(--text-dark)',
  });

  return (
    <div className="main-container">
      <div style={{ textAlign: 'right', color: 'var(--text-gray)', cursor: 'pointer' }} onClick={() => navigate('/register')}>Skip</div>
      <div style={{ marginTop: '30px' }}>
        <h1 style={{ color: 'var(--primary-green)', fontSize: '28px', fontWeight: '800' }}>SabiWork</h1>
        <h2 style={{ fontSize: '36px', marginTop: '15px', lineHeight: '1.1', fontWeight: 'bold' }}>
          Work <span style={{ color: 'var(--primary-green)' }}>smart.</span><br />Get paid <span style={{ color: 'var(--primary-green)' }}>fair.</span>
        </h2>
      </div>
      <div style={{ height: '220px', backgroundColor: '#f0fdf4', margin: '30px 0', borderRadius: '20px' }}></div>
      <div>
        <button style={getButtonStyle('worker')} onClick={() => handleRoleSelection('worker')}>I'm a Worker / Artisan</button>
        <button style={getButtonStyle('trader')} onClick={() => handleRoleSelection('trader')}>I'm a Trader / Business</button>
      </div>
    </div>
  );
};

export default Landing;