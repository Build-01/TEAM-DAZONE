import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const chatPartners = [
    { id: 1, name: 'Adekunle Jones' },
    { id: 2, name: 'Blessing Okon' },
    { id: 3, name: 'Musa Ibrahim' }
  ];

  const currentPartner = chatPartners.find(p => p.id === parseInt(id)) || chatPartners[0];

  return (
    /* We are using flex column to stack Header, Messages, Input, and Nav */
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '850px', backgroundColor: '#fff', overflow: 'hidden' }}>
      
      {/* HEADER */}
      <div style={chatHeader}>
        <div style={{ cursor: 'pointer', padding: '5px' }} onClick={() => navigate('/chat-list')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <div style={{ flex: 1, marginLeft: '15px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{currentPartner.name}</h4>
          <span style={{ fontSize: '12px', color: 'var(--primary-green)' }}>● Online</span>
        </div>
      </div>

      {/* MESSAGES AREA (This part scrolls) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#fdfdfd' }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
          <div style={bubbleThem}>Hello Tunde, regarding the request...</div>
        </div>
      </div>

      {/* INPUT AREA */}
      <div style={inputArea}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          style={chatInput} 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button style={sendBtn} onClick={() => setText('')}>➔</button>
      </div>

      {/* NAVIGATION BAR (Naturally sits at the bottom because of flex: 1 above) */}
      <div style={bottomNavStyle}>
        <div style={navItem} onClick={() => navigate('/dashboard')}>
          <HomeIcon color="#9ca3af" />
          <div style={{ marginTop: '4px' }}>Home</div>
        </div>
        <div style={navItem} onClick={() => navigate('/contracts')}>
          <ContractIcon color="#9ca3af" />
          <div style={{ marginTop: '4px' }}>Contracts</div>
        </div>
        <div style={navItem} onClick={() => navigate('/payments')}>
          <PaymentIcon color="#9ca3af" />
          <div style={{ marginTop: '4px' }}>Payments</div>
        </div>
        <div style={navItemActive} onClick={() => navigate('/chat-list')}>
          <MessageIcon color="var(--primary-purple)" />
          <div style={{ marginTop: '4px' }}>Messages</div>
        </div>
        <div style={navItem} onClick={() => navigate('/profile')}>
          <ProfileIcon color="#9ca3af" />
          <div style={{ marginTop: '4px' }}>Profile</div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES (No Absolute Positioning) ---
const chatHeader = { display: 'flex', alignItems: 'center', padding: '50px 20px 15px', borderBottom: '1px solid #f3f4f6' };
const bubbleThem = { padding: '12px 16px', fontSize: '14px', backgroundColor: '#f3f4f6', color: '#1d1d1f', borderRadius: '18px 18px 18px 2px' };
const inputArea = { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 20px', borderTop: '1px solid #f3f4f6' };
const chatInput = { flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #e5e7eb', outline: 'none' };
const sendBtn = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-purple)', border: 'none', color: 'white', cursor: 'pointer' };

const bottomNavStyle = { 
  height: '80px', 
  backgroundColor: 'white', 
  borderTop: '1px solid #eee', 
  display: 'flex', 
  justifyContent: 'space-around', 
  alignItems: 'center', 
  paddingBottom: '15px' 
};

const navItem = { textAlign: 'center', fontSize: '11px', color: '#9ca3af', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 };
const navItemActive = { ...navItem, color: 'var(--primary-purple)', fontWeight: 'bold' };

// --- ICONS ---
const HomeIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const ContractIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>);
const PaymentIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const MessageIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ProfileIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

export default Messages;