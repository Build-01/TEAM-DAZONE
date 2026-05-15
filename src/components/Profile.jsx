import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      
      {/* SCROLLABLE CONTENT */}
      <div className="content-area">
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <div style={profilePic}>
            <img src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=150&q=80" alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '15px 0 5px' }}>Tunde</h2>
          <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>Lagos, Nigeria</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 5px' }}>
          <div style={profileLink}><span>Personal Information</span> ❯</div>
          <div style={profileLink}><span>Security & Password</span> ❯</div>
          <div style={profileLink}><span>Support Center</span> ❯</div>
          
          <div style={switchBox}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Switch to Artisan</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-gray)' }}>Earn money providing services</p>
            </div>
            <div style={toggleBtn}></div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
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
        <div style={navItem} onClick={() => navigate('/chat-list')}>
          <MessageIcon color="#6b7280" />
          <div style={{ marginTop: '4px' }}>Messages</div>
        </div>
        <div style={navItemActive} onClick={() => navigate('/profile')}>
          <ProfileIcon color="var(--primary-green)" />
          <div style={{ marginTop: '4px' }}>Profile</div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const profilePic = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-green)', color: '#F7fbfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(17, 122, 101, 0.2)' };
const profileLink = { padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-light)', display: 'flex', justifyContent: 'space-between', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(29, 29, 31, 0.08), 0 2px 4px -1px rgba(29, 29, 31, 0.08)', border: '1px solid rgba(107, 114, 128, 0.25)' };
const switchBox = { ...profileLink, border: '1px solid rgba(17, 122, 101, 0.5)', backgroundColor: 'var(--bg-light)', marginTop: '10px' };
const toggleBtn = { width: '40px', height: '20px', borderRadius: '20px', backgroundColor: '#6b7280' };

const navItem = { textAlign: 'center', fontSize: '11px', color: '#6b7280', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 };
const navItemActive = { ...navItem, color: 'var(--primary-green)', fontWeight: 'bold' };

// --- ICON COMPONENTS ---
const HomeIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const ContractIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>);
const PaymentIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>);
const MessageIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ProfileIcon = ({ color }) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

export default Profile;