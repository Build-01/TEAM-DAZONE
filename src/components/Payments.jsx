import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, type: 'Escrow Payment', to: 'Adekunle Jones', amount: '₦45,000', date: 'May 12', status: 'Success' },
    { id: 2, type: 'Direct Pay', to: 'Blessing Okon', amount: '₦50,000', date: 'May 10', status: 'Success' }
  ];

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', height: '850px', position: 'relative', paddingBottom: '100px' }}>
      <div style={balanceCard}>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Wallet Balance</p>
        <h2 style={{ margin: '10px 0', fontSize: '32px', fontWeight: 'bold' }}>₦12,500</h2>
        <button style={topUpBtn}>+ Top Up Wallet</button>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '25px 0 15px' }}>Transaction History</h3>
      {transactions.map(tx => (
        <div key={tx.id} style={txRow}>
          <div style={txIcon}>₦</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>{tx.to}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{tx.type} • {tx.date}</p>
          </div>
          <p style={{ fontWeight: 'bold', color: 'var(--primary-purple)' }}>{tx.amount}</p>
        </div>
      ))}

      {/* Bottom Nav */}
      <div style={bottomNavStyle}>
        <div style={navItem} onClick={() => navigate('/dashboard')}><HomeIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Home</div></div>
        <div style={navItem} onClick={() => navigate('/contracts')}><ContractIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Contracts</div></div>
        <div style={navItemActive} onClick={() => navigate('/payments')}><PaymentIcon color="var(--primary-purple)" /><div style={{ marginTop: '4px' }}>Payments</div></div>
        <div style={navItem} onClick={() => navigate('/chat-list')}><MessageIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Messages</div></div>
        <div style={navItem} onClick={() => navigate('/profile')}><ProfileIcon color="#9ca3af" /><div style={{ marginTop: '4px' }}>Profile</div></div>
      </div>
    </div>
  );
};

const balanceCard = { padding: '25px', borderRadius: '24px', backgroundColor: 'var(--primary-purple)', color: 'white' };
const topUpBtn = { padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const txRow = { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #f3f4f6' };
const txIcon = { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
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
export default Payments;