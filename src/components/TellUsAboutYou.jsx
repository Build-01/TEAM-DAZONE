import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TellUsAboutYou = () => {
  const navigate = useNavigate();
  
  // State for selections
  const [language, setLanguage] = useState('English');
  const [selectedSkills, setSelectedSkills] = useState(['Tailoring', 'Carpentry']);

  // Updated language list
  const languages = ['English', 'Pidgin'];
  const skills = ['Tailoring', 'Carpentry', 'Plumbing', 'Welding', 'Hairdressing', 'Electrical'];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 3) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  return (
    <div className="main-container">
      <div className="content-area">
        {/* Header */}
        <div style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>Tell us about you</h2>
        <p style={{ color: 'var(--text-gray)', marginTop: '8px', marginBottom: '30px' }}>This helps us personalize your experience</p>

        {/* Location Input */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>Your Location</label>
          <div style={{ position: 'relative' }}>
            <input type="text" defaultValue="Balogun Market, Lagos" className="ui-input" />
            <span style={{ position: 'absolute', right: '15px', top: '14px', color: 'var(--text-dark)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </div>
        </div>

        {/* Language Selection - Now only English and Pidgin */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>Preferred Language</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  ...pillStyle,
                  backgroundColor: language === lang ? 'var(--primary-green)' : 'var(--bg-light)',
                  color: language === lang ? '#F7fbfa' : 'var(--text-gray)',
                  boxShadow: language === lang ? '0 4px 6px rgba(17, 122, 101, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                  border: language === lang ? 'none' : '1px solid rgba(107, 114, 128, 0.1)',
                  flex: 1 // Makes both buttons equal width
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>What are you good at? (Select up to 3)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  ...pillStyle,
                  backgroundColor: selectedSkills.includes(skill) ? 'var(--primary-green)' : 'var(--bg-light)',
                  color: selectedSkills.includes(skill) ? '#F7fbfa' : 'var(--text-gray)',
                  boxShadow: selectedSkills.includes(skill) ? '0 4px 6px rgba(17, 122, 101, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                  border: selectedSkills.includes(skill) ? 'none' : '1px solid rgba(107, 114, 128, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {skill} {selectedSkills.includes(skill) && '✓'}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown with Chevron Arrow */}
        <div style={{ marginBottom: '40px' }}>
          <label style={labelStyle}>Business Type (for traders)</label>
          <div style={{ position: 'relative' }}>
            <select className="ui-input" style={{ appearance: 'none', cursor: 'pointer' }}>
              <option value="" disabled selected>Select your business type</option>
              <option>Fashion / Clothing</option>
              <option>Electronics & Gadgets</option>
              <option>Food / Groceries</option>
              <option>Home / Furniture</option>
              <option>Beauty / Cosmetics</option>
              <option>Automobile Parts</option>
              <option>General Hardware</option>
            </select>
            <span style={arrowStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div style={{ padding: '20px 25px 35px 25px', backgroundColor: 'var(--bg-light)', borderTop: '1px solid rgba(107, 114, 128, 0.15)', boxShadow: '0 -4px 10px rgba(29, 29, 31, 0.05)' }}>
        <button 
          className="btn-primary btn-onboarding" 
          onClick={() => navigate('/dashboard')}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '10px', color: 'var(--text-gray)', fontWeight: '500' };

const arrowStyle = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#6b7280'
};

const pillStyle = { 
  padding: '12px 20px', 
  borderRadius: '10px', 
  fontSize: '14px', 
  fontWeight: '600', 
  cursor: 'pointer', 
  transition: 'all 0.2s ease' 
};

export default TellUsAboutYou;