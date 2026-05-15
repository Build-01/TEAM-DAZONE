import React from 'react';
import { useNavigate } from 'react-router-dom';

const MatchResults = () => {
  const navigate = useNavigate();

  // Mock data for artisans
  const artisans = [
    {
      id: 1,
      name: 'Adekunle Jones',
      role: 'Master POP Installer',
      rating: 4.9,
      match: '98%',
      price: '₦45,000',
      image: '👨🏾‍🔧'
    },
    {
      id: 2,
      name: 'Blessing Okon',
      role: 'Interior Specialist',
      rating: 4.7,
      match: '92%',
      price: '₦50,000',
      image: '👩🏾‍🔧'
    },
    {
      id: 3,
      name: 'Musa Ibrahim',
      role: 'General Contractor',
      rating: 4.5,
      match: '85%',
      price: '₦40,000',
      image: '👨🏾'
    }
  ];

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '850px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Top Matches for you</h2>
      </div>

      <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '25px' }}>
        We found {artisans.length} professionals that fit your requirements perfectly.
      </p>

      {/* Results List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {artisans.map(artisan => (
          <div key={artisan.id} style={artisanCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={matchBadge}>{artisan.match} Match</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-purple)' }}>{artisan.price}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={profileCircle}>{artisan.image}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>{artisan.name}</h4>
                <p style={{ margin: '2px 0', fontSize: '13px', color: 'var(--text-gray)' }}>{artisan.role}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '4px' }}>
                  <span style={{ color: '#f59e0b' }}>★</span> {artisan.rating} (42 reviews)
                </div>
              </div>
            </div>

            {/* Now navigating dynamically using the ID */}
            <button 
              style={hireBtn}
              onClick={() => navigate(`/artisan-profile/${artisan.id}`)}
            >
              View Profile & Hire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const artisanCard = {
  padding: '18px',
  borderRadius: '20px',
  border: '1px solid #f3f4f6',
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
};

const matchBadge = {
  padding: '4px 10px',
  borderRadius: '20px',
  backgroundColor: '#f0fdf4',
  color: 'var(--primary-green)',
  fontSize: '12px',
  fontWeight: 'bold'
};

const profileCircle = {
  width: '55px',
  height: '55px',
  borderRadius: '50%',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px'
};

const hireBtn = {
  width: '100%',
  marginTop: '15px',
  padding: '12px',
  borderRadius: '12px',
  border: `1.5px solid var(--primary-purple)`,
  backgroundColor: 'transparent',
  color: 'var(--primary-purple)',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

export default MatchResults;