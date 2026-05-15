import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostGig = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      
      {/* 1. FIXED HEADER */}
      <div style={headerArea}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg-light)" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Post a New Gig</h2>
        </div>

        {/* Progress Bar */}
        <div style={progressBg}>
          <div style={progressFill}></div>
        </div>
      </div>

      {/* 2. SCROLLABLE FORM AREA */}
      <div className="content-area">
        <div style={inputGroup}>
          <label style={labelStyle}>What do you need help with?</label>
          <input type="text" placeholder="e.g. Install POP ceiling" className="ui-input" />
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Category</label>
          <div style={{ position: 'relative' }}>
            <select className="ui-input" style={{ appearance: 'none', cursor: 'pointer' }}>
              <option>Construction & Repairs</option>
              <option>Tailoring & Fashion</option>
              <option>Electrical Works</option>
              <option>Plumbing</option>
              <option>Cleaning Services</option>
            </select>
            <span style={chevronStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </span>
          </div>
        </div>

        <div style={inputGroup}>
          <label style={labelStyle}>Describe the work in detail</label>
          <textarea 
            placeholder="Tell the artisan exactly what needs to be done..." 
            className="ui-input"
            style={{ height: '100px', resize: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Budget (₦)</label>
            <input type="number" placeholder="50,000" className="ui-input" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Target Date</label>
            <input type="date" className="ui-input" />
          </div>
        </div>
      </div>

      {/* 3. FIXED FOOTER ACTION */}
      <div style={footerArea}>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/match-results')}
        >
          Find Best Matches
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const headerArea = { 
  padding: '40px 20px 10px', 
  backgroundColor: 'var(--bg-light)',
  borderBottom: '1px solid rgba(107, 114, 128, 0.15)',
  boxShadow: '0 2px 10px rgba(29, 29, 31, 0.03)'
};

const footerArea = { 
  padding: '20px 25px 35px 25px', 
  borderTop: '1px solid rgba(107, 114, 128, 0.15)', 
  backgroundColor: 'var(--bg-light)',
  boxShadow: '0 -4px 10px rgba(29, 29, 31, 0.05)'
};

const progressBg = { width: '100%', height: '4px', backgroundColor: '#F7fbfa', borderRadius: '2px' };
const progressFill = { width: '40%', height: '100%', backgroundColor: 'var(--primary-green)', borderRadius: '2px' };

const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' };

const chevronStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' };

export default PostGig;