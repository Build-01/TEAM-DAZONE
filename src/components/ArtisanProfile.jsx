import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would normally come from a database, but we'll use the same mock data
  const artisans = [
    { id: 1, name: 'Adekunle Jones', role: 'Master POP Installer', rating: 4.9, match: '98%', price: '₦45,000', bio: 'Expert in modern POP designs and screeding with 10+ years experience in Lagos.', image: '👨🏾‍🔧' },
    { id: 2, name: 'Blessing Okon', role: 'Interior Specialist', rating: 4.7, match: '92%', price: '₦50,000', bio: 'Specializing in premium interior finishes and color coordination for luxury homes.', image: '👩🏾‍🔧' },
    { id: 3, name: 'Musa Ibrahim', role: 'General Contractor', rating: 4.5, match: '85%', price: '₦40,000', bio: 'Reliable contractor for all types of home repairs and maintenance.', image: '👨🏾' }
  ];

  // Find the specific artisan based on the ID in the URL
  const artisan = artisans.find(a => a.id === parseInt(id));

  if (!artisan) return <div className="main-container">Artisan not found</div>;

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '850px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={bigProfileCircle}>{artisan.image}</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0 5px' }}>{artisan.name}</h2>
        <p style={{ color: 'var(--primary-purple)', fontWeight: '600', margin: 0 }}>{artisan.role}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
          <div style={statItem}><b>{artisan.rating}</b> ★</div>
          <div style={statItem}><b>42</b> Reviews</div>
          <div style={statItem}><b>{artisan.match}</b> Match</div>
        </div>
      </div>

      {/* About Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={sectionTitle}>About</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: '1.6' }}>{artisan.bio}</p>
      </div>

      {/* Portfolio Gallery Placeholder */}
      <div style={{ flex: 1 }}>
        <h3 style={sectionTitle}>Portfolio</h3>
        <div style={galleryGrid}>
          <div style={galleryItem}></div>
          <div style={galleryItem}></div>
          <div style={galleryItem}></div>
          <div style={galleryItem}></div>
        </div>
      </div>

      {/* Fixed Footer with Price & Hire */}
      <div style={footerRow}>
        <div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-gray)' }}>Starting from</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-purple)' }}>{artisan.price}</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ width: '180px', backgroundColor: 'var(--primary-purple)' }}
          onClick={() => navigate('/confirm-order', { state: { artisan } })}
        >
          Hire Now
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const bigProfileCircle = { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f3f4f6', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px' };
const statItem = { fontSize: '13px', color: 'var(--text-dark)' };
const sectionTitle = { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' };
const galleryGrid = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' };
const galleryItem = { height: '100px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #eee' };
const footerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderTop: '1px solid #eee', marginTop: '20px' };

export default ArtisanProfile;