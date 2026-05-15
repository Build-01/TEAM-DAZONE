import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contracts = () => {
  const navigate = useNavigate();

  const activeContracts = [
    { id: 1, title: 'POP Ceiling Installation', artisan: 'Adekunle Jones', status: 'In Progress', color: 'var(--primary-purple)' },
    { id: 2, title: 'Electrical Wiring', artisan: 'Musa Ibrahim', status: 'Pending', color: '#f59e0b' }
  ];

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', height: '850px', position: 'relative', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>My Contracts</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {activeContracts.map(item => (
          <div key={item.id} style={contractCard} onClick={() => navigate(`/contract/${item.id}`)}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{item.title}</h4>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-gray)' }}>{item.artisan}</p>
            </div>
            <div style={{ ...statusTag, color: item.color, backgroundColor: `${item.color}10` }}>{item.status}</div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={bottomNavStyle}>
        <div style={navItem} onClick={() => navigate('/dashboard')}><HomeIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Home</div></div>
        <div style={navItemActive} onClick={() => navigate('/contracts')}><ContractIcon color="var(--primary-purple)" /><div style={{ marginTop: '4px' }}>Contracts</div></div>
        <div style={navItem} onClick={() => navigate('/payments')}><PaymentIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Payments</div></div>
        <div style={navItem} onClick={() => navigate('/chat-list')}><MessageIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Messages</div></div>
        <div style={navItem} onClick={() => navigate('/profile')}><ProfileIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Profile</div></div>
      </div>
    </div>
  );
};

const contractCard = { padding: '18px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', cursor: 'pointer' };
const statusTag = { padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' };
// ... (Copy bottomNavStyle and Icons from Dashboard.jsx)
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

// --- NAVIGATION STYLES ---
const bottomNavStyle = { 
  position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', 
  backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', 
  justifyContent: 'space-around', alignItems: 'center', paddingBottom: '15px', boxSizing: 'border-box' 
};
const navItem = { 
  textAlign: 'center', fontSize: '11px', color: '#9ca3af', cursor: 'pointer', 
  display: 'flex', flexDirection: 'column', alignItems: 'center' 
};
const navItemActive = { 
  textAlign: 'center', fontSize: '11px', color: 'var(--primary-purple)', 
  fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' 
};
export default Contracts;