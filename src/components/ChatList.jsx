import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const navigate = useNavigate();

  const chats = [
    { id: 1, name: 'Adekunle Jones', lastMsg: 'Does 2:00 PM work for you?', time: '10:05 AM', unread: 2, img: '👨🏾‍🔧' },
    { id: 2, name: 'Blessing Okon', lastMsg: 'I have sent the invoice.', time: 'Yesterday', unread: 0, img: '👩🏾‍🔧' },
    { id: 3, name: 'Musa Ibrahim', lastMsg: 'Please send the location.', time: 'Monday', unread: 0, img: '👨🏾' }
  ];

  return (
    <div style={layoutWrapper}>
      {/* 1. Header Area */}
      <div style={{ padding: '50px 20px 10px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Messages</h2>
      </div>
      
      {/* 2. Scrollable List Area (flex: 1 makes this fill the gap) */}
      <div style={scrollArea}>
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/messages/${chat.id}`)} 
            style={chatRow}
          >
            <div style={avatarStyle}>{chat.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{chat.name}</h4>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{chat.time}</span>
              </div>
              <p style={previewStyle}>{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && <div style={unreadBadge}>{chat.unread}</div>}
          </div>
        ))}
      </div>

      {/* 3. Navigation Bar (Pinned to the bottom of the flex column) */}
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

// --- STYLES ---
const layoutWrapper = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '850px',
  backgroundColor: '#fff',
  overflow: 'hidden'
};

const scrollArea = {
  flex: 1,
  overflowY: 'auto',
  padding: '0 20px'
};

const chatRow = { 
  display: 'flex', 
  alignItems: 'center', 
  padding: '18px 0', 
  borderBottom: '1px solid #f3f4f6', 
  cursor: 'pointer', 
  gap: '15px' 
};

const avatarStyle = { 
  width: '50px', 
  height: '50px', 
  borderRadius: '50%', 
  backgroundColor: '#f3f4f6', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontSize: '24px' 
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
  backgroundColor: 'var(--primary-purple)', 
  color: 'white', 
  borderRadius: '50%', 
  width: '20px', 
  height: '20px', 
  fontSize: '10px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontWeight: 'bold' 
};

const bottomNavStyle = { 
  height: '80px', 
  backgroundColor: 'white', 
  borderTop: '1px solid #eee', 
  display: 'flex', 
  justifyContent: 'space-around', 
  alignItems: 'center', 
  paddingBottom: '15px' 
};

const navItem = { 
  textAlign: 'center', 
  fontSize: '11px', 
  color: '#9ca3af', 
  cursor: 'pointer', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  flex: 1 
};

const navItemActive = { 
  ...navItem, 
  color: 'var(--primary-purple)', 
  fontWeight: 'bold' 
};

// --- ICONS ---
const HomeIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const ContractIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>);
const PaymentIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const MessageIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ProfileIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

export default ChatList;