import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DescribeYou = () => {
  const [selected, setSelected] = useState('worker');
  const navigate = useNavigate();

  const roles = [
    {
      id: 'worker',
      title: 'Worker / Artisan',
      desc: "I have skills and I'm looking for work",
      icon: '👷🏾‍♀️'
    },
    {
      id: 'trader',
      title: 'Trader / Business',
      desc: 'I run a business or sell products',
      icon: '🏪'
    },
    {
      id: 'employer',
      title: 'Employer / Client',
      desc: 'I need to hire skilled workers',
      icon: '💼'
    }
  ];

  return (
    <div className="main-container" style={{ display: 'flex', flexDirection: 'column', height: '850px' }}>
      
      {/* Header */}
      <div>
        <div 
          style={{ cursor: 'pointer', marginBottom: '20px', display: 'inline-block' }} 
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>What best describes you?</h2>
        <p style={{ color: 'var(--text-gray)', marginTop: '12px', fontSize: '18px' }}>You can change this later</p>
      </div>

      {/* Cards Area - Space increased significantly */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px',   /* Increased gap between cards */
        marginTop: '60px', 
        flex: 1 
      }}>
        {roles.map((role) => (
          <div 
            key={role.id}
            onClick={() => setSelected(role.id)}
            style={{
              ...cardStyle,
              borderColor: selected === role.id ? 'var(--primary-green)' : '#e5e7eb',
              backgroundColor: selected === role.id ? '#f0fdf4' : 'white',
              boxShadow: selected === role.id ? '0 10px 15px -3px rgba(17, 122, 101, 0.1)' : 'none',
            }}
          >
            <div style={iconContainer}>{role.icon}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '20px', color: 'var(--primary-green)', fontWeight: '700' }}>{role.title}</h4>
              <p style={{ margin: '6px 0 0', fontSize: '15px', color: 'var(--text-gray)', lineHeight: '1.4' }}>{role.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <button 
          className="btn-primary btn-onboarding" 
          onClick={() => navigate('/tell-us-about-you')}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '32px 20px', /* Increased vertical padding to make cards beefier */
  borderRadius: '24px',
  border: '2px solid #e5e7eb',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  gap: '18px',
  boxSizing: 'border-box'
};

const iconContainer = {
  width: '64px',
  height: '64px',
  borderRadius: '18px',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '30px'
};

export default DescribeYou;