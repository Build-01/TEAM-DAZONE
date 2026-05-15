import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', position: 'relative', paddingBottom: '100px' }}>
      
      {/* 1. Header: Brand & Notifications */}
      <div style={headerStyle}>
        <h1 style={{ color: 'var(--primary-purple)', fontSize: '22px', fontWeight: '800', margin: 0 }}>SabiWork</h1>
        <div style={iconCircle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
      </div>

      {/* 2. Welcome Message */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '400', margin: 0 }}>Good morning,</h2>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '4px' }}>Tunde 👋</h2>
        <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>Let's get your work done.</p>
      </div>

      {/* 3. Primary Action Button */}
      <button 
        style={postGigBtn} 
        onClick={() => navigate('/post-gig')}
      >
        <span style={{ fontSize: '22px', marginRight: '10px' }}>+</span> Post a New Gig
      </button>

      {/* 4. Stat Cards Row */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <div style={statCard}>
          <p style={statLabel}>Active Contracts</p>
          <p style={statValue}>2</p>
          <span style={viewAllLink} onClick={() => navigate('/contracts')}>View all ›</span>
        </div>
        
        <div style={statCard} onClick={() => navigate('/payments')} style={{...statCard, cursor: 'pointer'}}>
          <p style={statLabel}>Total Spent (This Month)</p>
          <p style={statValue}>₦430,000</p>
          <span style={{ color: '#117a65', fontSize: '12px', fontWeight: 'bold' }}>↑ 15%</span>
        </div>
      </div>

      {/* 5. Recent Activity List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Recent Activity</h3>
          <span style={{ color: 'var(--primary-purple)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/contracts')}>See all</span>
        </div>

        <div 
          style={{ ...activityItem, cursor: 'pointer' }} 
          onClick={() => navigate('/contract/1')}
        >
          <div style={activityIcon}>🛠️</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', margin: 0 }}>POP Ceiling Installation</p>
            <p style={{ fontSize: '13px', color: 'var(--primary-purple)', margin: '2px 0 0' }}>In Progress</p>
          </div>
        </div>

        <div style={activityItem}>
          <div style={activityIcon}>👕</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', margin: 0 }}>Ankara Shirts (50)</p>
            <p style={{ fontSize: '13px', color: 'var(--primary-green)', margin: '2px 0 0' }}>Completed</p>
          </div>
        </div>
      </div>

      {/* 6. Sticky Bottom Navigation (FULLY FUNCTIONAL) */}
      <div style={bottomNavStyle}>
        <div style={navItemActive} onClick={() => navigate('/dashboard')}>
          <HomeIcon color="var(--primary-purple)" />
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
        
        <div style={navItem} onClick={() => navigate('/chat-list')}>
          <MessageIcon color="#9ca3af" />
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

// --- STYLES ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' };
const iconCircle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f7fbfa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const postGigBtn = { width: '100%', padding: '18px', borderRadius: '16px', border: 'none', backgroundColor: 'var(--primary-purple)', color: 'white', fontWeight: 'bold', fontSize: '16px', margin: '25px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statCard = { flex: 1, padding: '16px', borderRadius: '20px', backgroundColor: '#fff', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const statLabel = { fontSize: '11px', color: 'var(--text-gray)', fontWeight: '600', margin: '0 0 6px 0', textTransform: 'uppercase' };
const statValue = { fontSize: '19px', fontWeight: '800', margin: '0 0 8px 0' };
const viewAllLink = { fontSize: '12px', color: 'var(--primary-purple)', fontWeight: '600', cursor: 'pointer' };
const activityItem = { display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px', marginBottom: '12px', gap: '15px' };
const activityIcon = { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const bottomNavStyle = { position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '15px', boxSizing: 'border-box' };
const navItem = { textAlign: 'center', fontSize: '11px', color: '#9ca3af', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const navItemActive = { textAlign: 'center', fontSize: '11px', color: 'var(--primary-purple)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' };

export default Dashboard;