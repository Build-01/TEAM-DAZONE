import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const chatPartners = [
    { id: 1, name: 'Adekunle Jones', initialMsg: "Hello Tunde, I've seen your request for the POP ceiling." },
    { id: 2, name: 'Blessing Okon', initialMsg: "Hi Tunde, the invoice for the Ankara shirts is ready." },
    { id: 3, name: 'Musa Ibrahim', initialMsg: "Good day, please send the location for the wiring job." }
  ];

  // This finds the specific person based on the URL ID
  const currentPartner = chatPartners.find(p => p.id === parseInt(id)) || chatPartners[0];

  return (
    <div className="main-container">
      
      {/* HEADER */}
      <div style={chatHeader}>
        <div style={{ cursor: 'pointer', padding: '5px' }} onClick={() => navigate('/chat-list')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bg-light)" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <div style={{ flex: 1, marginLeft: '15px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{currentPartner.name}</h4>
          <span style={{ fontSize: '12px', color: '#117a65' }}>● Online</span>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="content-area" style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'var(--bg-light)' }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
          <div style={bubbleThem}>
            {currentPartner.initialMsg}
          </div>
        </div>
        
        {/* User's sent messages would appear here */}
        {text && (
           <div style={{ alignSelf: 'flex-end', maxWidth: '80%', marginTop: '10px' }}>
             <div style={bubbleMe}>Draft: {text}</div>
           </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div style={inputArea}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="ui-input"
          style={{ height: '50px', borderRadius: '25px' }} 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button style={sendBtn} onClick={() => setText('')}>➔</button>
      </div>

      {/* NAVIGATION BAR */}
      <div style={bottomNavStyle}>
        <div style={navItem} onClick={() => navigate('/dashboard')}>
          <HomeIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Home</div>
        </div>
        <div style={navItem} onClick={() => navigate('/contracts')}>
          <ContractIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Contracts</div>
        </div>
        <div style={navItem} onClick={() => navigate('/payments')}>
          <PaymentIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Payments</div>
        </div>
        <div style={navItemActive} onClick={() => navigate('/chat-list')}>
          <MessageIcon color="var(--primary-green)" />
          <div style={{ marginTop: '4px' }}>Messages</div>
        </div>
        <div style={navItem} onClick={() => navigate('/profile')}>
          <ProfileIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Profile</div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const chatHeader = { 
  display: 'flex', 
  alignItems: 'center', 
  padding: '40px 20px 15px', 
  borderBottom: '1px solid rgba(107, 114, 128, 0.15)',
  backgroundColor: 'var(--bg-light)',
  boxShadow: '0 2px 10px rgba(29, 29, 31, 0.08)',
  border: '1px solid rgba(107, 114, 128, 0.25)'
};

const bubbleThem = { padding: '12px 16px', fontSize: '14px', backgroundColor: 'var(--bg-light)', border: '1px solid rgba(107, 114, 128, 0.25)', color: '#1d1d1f', borderRadius: '18px 18px 18px 2px', boxShadow: '0 2px 5px rgba(29, 29, 31, 0.08)' };
const bubbleMe = { padding: '12px 16px', fontSize: '14px', backgroundColor: 'var(--primary-green)', color: '#F7fbfa', borderRadius: '18px 18px 2px 18px', boxShadow: '0 2px 5px rgba(17, 122, 101, 0.2)' };

const inputArea = { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 20px', borderTop: '1px solid rgba(107, 114, 128, 0.15)', backgroundColor: 'var(--bg-light)' };
const sendBtn = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-green)', border: 'none', color: '#F7fbfa', cursor: 'pointer', boxShadow: '0 4px 6px rgba(17, 122, 101, 0.2)' };

const bottomNavStyle = { 
  height: '100px', 
  backgroundColor: 'var(--bg-light)', 
  borderTop: '1px solid rgba(107, 114, 128, 0.15)', 
  boxShadow: '0 -4px 10px rgba(29, 29, 31, 0.05)',
  display: 'flex', 
  justifyContent: 'space-around', 
  alignItems: 'center', 
  paddingBottom: '35px',
  paddingLeft: '20px',
  paddingRight: '20px'
};

const navItem = { textAlign: 'center', fontSize: '11px', color: '#6b7280', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 };
const navItemActive = { ...navItem, color: 'var(--primary-green)', fontWeight: 'bold' };

// --- ICONS ---
const HomeIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const ContractIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>);
const PaymentIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const MessageIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ProfileIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

export default Messages;