import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const navigate = useNavigate();

  const chats = [
    { id: 1, name: 'Adekunle Jones', lastMsg: 'Does 2:00 PM work for you?', time: '10:05 AM', unread: 2, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: 'Blessing Okon', lastMsg: 'I have sent the invoice.', time: 'Yesterday', unread: 0, img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: 'Musa Ibrahim', lastMsg: 'Please send the location.', time: 'Monday', unread: 0, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <div className="main-container">
      <div className="content-area">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--text-dark)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Messages</h2>
        </div>
        
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/messages/${chat.id}`)} 
            style={chatRow}
          >
            <div style={avatarStyle}>
              <img src={chat.img} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ color: 'var(--text-dark)', margin: 0, fontSize: '16px', fontWeight: '700' }}>{chat.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-gray)' }}>{chat.time}</span>
              </div>
              <p style={{...previewStyle, color: 'var(--text-gray)'}}>{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && <div style={unreadBadge}>{chat.unread}</div>}
          </div>
        ))}
      </div>

      {/* 3. Navigation Bar (Pinned to bottom) */}
      <div className="glass-nav">
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
const chatRow = { 
  display: 'flex', 
  alignItems: 'center', 
  padding: '18px 0', 
  borderBottom: '1px solid rgba(107, 114, 128, 0.15)', 
  cursor: 'pointer', 
  gap: '15px' 
};

const avatarStyle = { 
  width: '50px', 
  height: '50px', 
  borderRadius: '50%', 
  backgroundColor: 'var(--bg-light)', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontSize: '24px',
  boxShadow: '0 2px 5px rgba(29, 29, 31, 0.08)',
  border: '1px solid rgba(107, 114, 128, 0.25)'
};

const previewStyle = { 
  margin: '4px 0 0', 
  fontSize: '13px', 
  color: '#6b7280', 
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis', 
  maxWidth: '200px' 
};

const unreadBadge = { 
  backgroundColor: 'var(--primary-green)', 
  color: '#F7fbfa', 
  borderRadius: '50%', 
  width: '20px', 
  height: '20px', 
  fontSize: '10px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontWeight: 'bold' 
};

const navItem = { 
  textAlign: 'center', 
  fontSize: '11px', 
  color: '#6b7280', 
  cursor: 'pointer', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  flex: 1 
};

const navItemActive = { 
  ...navItem, 
  color: 'var(--primary-green)', 
  fontWeight: 'bold' 
};

// --- ICONS ---
const HomeIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const ContractIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>);
const PaymentIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const MessageIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ProfileIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

export default ChatList;