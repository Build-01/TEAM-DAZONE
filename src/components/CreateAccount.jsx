import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the role passed from the landing page
  const chosenRole = location.state?.role;

  const handleCreateAccount = () => {
    // Logic: Skip 'describe-you' if role is already known
    if (chosenRole) {
      navigate('/tell-us-about-you');
    } else {
      navigate('/describe-you');
    }
  };

  // Professional SVG Icons
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
  );

  return (
    <div className="main-container">
      {/* Back Button */}
      <div 
        style={{ cursor: 'pointer', marginBottom: '20px', display: 'inline-block' }} 
        onClick={() => navigate(-1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </div>

      <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>Create your account</h2>
      <p style={{ color: 'var(--text-gray)', marginBottom: '30px', marginTop: '8px' }}>Let's get you started</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Phone or Email</label>
          <input type="text" placeholder="+234 801 234 5678" style={inputStyle} />
        </div>

        <div style={{ position: 'relative' }}>
          <label style={labelStyle}>Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••••••" 
            style={inputStyle} 
          />
          <span 
            style={eyeIconStyle} 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </span>
        </div>

        <div>
          <label style={labelStyle}>Referral Code (optional)</label>
          <input type="text" placeholder="AMINA123" style={inputStyle} />
        </div>
      </div>

      <button 
        className="btn-primary btn-onboarding" 
        style={{ marginTop: '30px', boxSizing: 'border-box' }}
        onClick={handleCreateAccount}
      >
        Create Account
      </button>

      <div style={dividerContainer}>
        <div style={line}></div>
        <span style={{ padding: '0 10px', color: 'var(--text-gray)', fontSize: '12px' }}>or continue with</span>
        <div style={line}></div>
      </div>

      {/* Social Buttons with Logos */}
      <button style={socialButtonStyle}>
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="google" 
          style={{ width: '18px', height: '18px', marginRight: '10px' }} 
        />
        Continue with Google
      </button>

      <button style={socialButtonStyle}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" 
          alt="fb" 
          style={{ width: '18px', height: '18px', marginRight: '10px' }} 
        />
        Continue with Facebook
      </button>

      <p style={termsStyle}>
        By creating an account, you agree to our <span style={{ color: 'var(--primary-green)', cursor: 'pointer' }}>Terms & Conditions</span>
      </p>
    </div>
  );
};

// --- STYLES ---
const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', outline: 'none', boxSizing: 'border-box' };
const eyeIconStyle = { position: 'absolute', right: '12px', top: '38px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' };
const socialButtonStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', cursor: 'pointer', fontWeight: '500', boxSizing: 'border-box' };
const dividerContainer = { display: 'flex', alignItems: 'center', margin: '25px 0' };
const line = { flex: 1, height: '1px', backgroundColor: '#e5e7eb' };
const termsStyle = { textAlign: 'center', fontSize: '12px', color: 'var(--text-gray)', marginTop: '20px', lineHeight: '1.5' };

export default CreateAccount;