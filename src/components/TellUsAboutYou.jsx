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
    <div className="main-container" style={{ display: 'flex', flexDirection: 'column', height: '850px' }}>
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
          <input type="text" defaultValue="Balogun Market, Lagos" style={inputStyle} />
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
                backgroundColor: language === lang ? 'var(--primary-green)' : '#f3f4f6',
                color: language === lang ? 'white' : 'var(--text-gray)',
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
                backgroundColor: selectedSkills.includes(skill) ? 'var(--primary-green)' : '#f3f4f6',
                color: selectedSkills.includes(skill) ? 'white' : 'var(--text-gray)',
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
          <select style={selectStyle}>
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

      {/* Footer Button */}
      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
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

const inputStyle = { 
  width: '100%', 
  padding: '14px', 
  borderRadius: '12px', 
  border: '1px solid #e5e7eb', 
  fontSize: '16px', 
  boxSizing: 'border-box', 
  outline: 'none' 
};

const selectStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  fontSize: '16px',
  boxSizing: 'border-box',
  outline: 'none',
  appearance: 'none', 
  backgroundColor: 'white',
  cursor: 'pointer',
  color: '#1d1d1f'
};

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
  border: 'none', 
  fontSize: '14px', 
  fontWeight: '600', 
  cursor: 'pointer', 
  transition: 'all 0.2s ease' 
};

export default TellUsAboutYou;