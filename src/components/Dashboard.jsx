import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      
      {/* Scrollable Content starts here */}
      <div className="content-area">
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={{ color: 'var(--text-dark)', fontSize: '22px', fontWeight: '800', margin: 0 }}>SabiWork</h1>
          <div style={iconCircle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
        </div>

        {/* Welcome Message */}
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: 'var(--text-dark)', fontSize: '24px', fontWeight: '400', margin: 0 }}>Good morning,</h2>
          <h2 style={{ color: 'var(--text-dark)', fontSize: '26px', fontWeight: 'bold', marginTop: '4px' }}>Tunde 👋</h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>Let's get your work done.</p>
        </div>

        {/* Post Gig Button */}
        <button className="btn-primary" style={postGigBtn} onClick={() => navigate('/post-gig')}>
          <span style={{ fontSize: '22px', marginRight: '10px' }}>+</span> Post a New Gig
        </button>

        {/* Stat Cards Row */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <div className="ui-card" style={statCard}>
            <p style={statLabel}>Active Contracts</p>
            <p style={statValue}>2</p>
            <span style={viewAllLink} onClick={() => navigate('/contracts')}>View all ›</span>
          </div>
          <div className="ui-card" style={{...statCard, cursor: 'pointer'}} onClick={() => navigate('/payments')}>
            <p style={statLabel}>Total Spent</p>
            <p style={statValue}>₦430,000</p>
            <span style={{ color: 'var(--primary-green)', fontSize: '12px', fontWeight: 'bold' }}>↑ 15%</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: 'var(--text-dark)', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Recent Activity</h3>
            <span style={{ color: 'var(--primary-green)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/contracts')}>See all</span>
          </div>
          <div className="ui-card" style={{ ...activityItem, cursor: 'pointer' }} onClick={() => navigate('/contract/1')}>
            <div style={activityIcon}>
              <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=150&q=80" alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '700', margin: 0, color: 'var(--text-dark)' }}>POP Ceiling Installation</p>
              <div style={{ marginTop: '4px' }}>
                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: 'rgba(244, 183, 64, 0.15)', color: 'var(--primary-purple)' }}>In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Pinned to bottom of cardContainer) */}
      <div className="glass-nav">
        <div style={navItemActive} onClick={() => navigate('/dashboard')}>
          <HomeIcon color="var(--primary-green)" />
          <div style={{ marginTop: '4px' }}>Home</div>
        </div>
        <div style={navItem} onClick={() => navigate('/contracts')}>
          <ContractIcon color="var(--text-gray)" />
          <div style={{ marginTop: '4px' }}>Contracts</div>
        </div>
        <div style={navItem} onClick={() => navigate('/payments')}>
          <PaymentIcon color="var(--text-gray)" />
          <div style={{ marginTop: '4px' }}>Payments</div>
        </div>
        <div style={navItem} onClick={() => navigate('/chat-list')}>
          <MessageIcon color="var(--text-gray)" />
          <div style={{ marginTop: '4px' }}>Messages</div>
        </div>
        <div style={navItem} onClick={() => navigate('/profile')}>
          <ProfileIcon color="var(--text-gray)" />
          <div style={{ marginTop: '4px' }}>Profile</div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const iconCircle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(29, 29, 31, 0.08)', border: '1px solid rgba(107, 114, 128, 0.25)' };
const postGigBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '25px 0' };
const statCard = { flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' };
const statLabel = { fontSize: '11px', color: 'var(--text-gray)', fontWeight: '600', margin: '0 0 6px 0', textTransform: 'uppercase' };
const statValue = { fontSize: '19px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-dark)' };
const viewAllLink = { fontSize: '12px', color: 'var(--primary-purple)', fontWeight: '600', cursor: 'pointer', marginTop: 'auto' };
const activityItem = { display: 'flex', alignItems: 'center', padding: '16px', marginBottom: '12px', gap: '15px' };
const activityIcon = { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' };

const navItem = { textAlign: 'center', fontSize: '11px', color: 'var(--text-gray)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 };
const navItemActive = { ...navItem, color: 'var(--primary-green)', fontWeight: 'bold' };

// --- ICONS ---
const HomeIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const ContractIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>);
const PaymentIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const MessageIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ProfileIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

export default Dashboard;