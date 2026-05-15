import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contracts = () => {
  const navigate = useNavigate();

  const activeContracts = [
    { id: 1, title: 'POP Ceiling Installation', artisan: 'Adekunle Jones', status: 'In Progress', color: 'var(--primary-purple)' },
    { id: 2, title: 'Electrical Wiring', artisan: 'Musa Ibrahim', status: 'Pending', color: '#f59e0b' }
  ];

  return (
    <div className="main-container">
      
      {/* HEADER AREA */}
      <div style={{ padding: '40px 20px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>My Contracts</h2>
      </div>
      
      {/* SCROLLABLE LIST */}
      <div className="content-area">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeContracts.map(item => (
            <div key={item.id} style={contractCard} onClick={() => navigate(`/contract/${item.id}`)}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{item.title}</h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-gray)' }}>{item.artisan}</p>
              </div>
              <div>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  backgroundColor: item.status === 'Completed' ? 'rgba(17, 122, 101, 0.15)' : 'rgba(244, 183, 64, 0.15)', 
                  color: item.status === 'Completed' ? 'var(--primary-green)' : 'var(--primary-purple)' 
                }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="glass-nav">
        <div style={navItem} onClick={() => navigate('/dashboard')}>
          <HomeIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Home</div>
        </div>
        <div style={navItemActive} onClick={() => navigate('/contracts')}>
          <ContractIcon color="var(--primary-green)" />
          <div style={{ marginTop: '4px' }}>Contracts</div>
        </div>
        <div style={navItem} onClick={() => navigate('/payments')}>
          <PaymentIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Payments</div>
        </div>
        <div style={navItem} onClick={() => navigate('/chat-list')}>
          <MessageIcon color="#6b7280" />
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
const contractCard = { 
  padding: '18px', 
  borderRadius: '16px', 
  display: 'flex', 
  alignItems: 'center', 
  cursor: 'pointer',
  backgroundColor: 'var(--bg-light)',
  boxShadow: '0 4px 6px -1px rgba(29, 29, 31, 0.08), 0 2px 4px -1px rgba(29, 29, 31, 0.08)',
  border: '1px solid rgba(107, 114, 128, 0.25)'
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

// --- ICON COMPONENTS ---
const HomeIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const ContractIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const PaymentIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);
const MessageIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const ProfileIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default Contracts;