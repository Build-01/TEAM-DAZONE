import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostGig = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '850px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Post a New Gig</h2>
      </div>

      {/* Progress Bar (Subtle hint that there are steps) */}
      <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', marginBottom: '30px' }}>
        <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--primary-purple)', borderRadius: '2px' }}></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Gig Title */}
        <div style={inputGroup}>
          <label style={labelStyle}>What do you need help with?</label>
          <input type="text" placeholder="e.g. Install POP ceiling in my living room" style={inputStyle} />
        </div>

        {/* Category Dropdown */}
        <div style={inputGroup}>
          <label style={labelStyle}>Category</label>
          <div style={{ position: 'relative' }}>
            <select style={selectStyle}>
              <option>Construction & Repairs</option>
              <option>Tailoring & Fashion</option>
              <option>Electrical Works</option>
              <option>Plumbing</option>
              <option>Cleaning Services</option>
            </select>
            <span style={chevronStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={inputGroup}>
          <label style={labelStyle}>Describe the work in detail</label>
          <textarea 
            placeholder="Tell the artisan exactly what needs to be done..." 
            style={{ ...inputStyle, height: '120px', resize: 'none', paddingTop: '12px' }}
          />
        </div>

        {/* Budget & Date Row */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Budget (₦)</label>
            <input type="number" placeholder="50,000" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Target Date</label>
            <input type="date" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <button 
          className="btn-primary" 
          style={{ backgroundColor: 'var(--primary-purple)', height: '55px' }}
          onClick={() => navigate('/match-results')}
        >
          Find Best Matches
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const inputGroup = { marginBottom: '25px' };
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' };
const inputStyle = { 
  width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', 
  fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fdfdfd' 
};
const selectStyle = { ...inputStyle, appearance: 'none', cursor: 'pointer' };
const chevronStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' };

export default PostGig;