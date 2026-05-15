import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // This would normally come from a database, but we'll use the same mock data
  const artisans = [
    { 
      id: 1, 
      name: 'Adekunle Jones', 
      role: 'Master POP Installer', 
      rating: 4.9, 
      match: '98%', 
      price: '₦45,000', 
      bio: 'Expert in modern POP designs and screeding with 10+ years experience in Lagos.', 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      portfolio: [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=300&q=80"
      ]
    },
    { 
      id: 2, 
      name: 'Blessing Okon', 
      role: 'Interior Specialist', 
      rating: 4.7, 
      match: '92%', 
      price: '₦50,000', 
      bio: 'Specializing in premium interior finishes and color coordination for luxury homes.', 
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80",
      portfolio: [
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1616489953149-8f2e67272763?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=300&q=80"
      ]
    },
    { 
      id: 3, 
      name: 'Musa Ibrahim', 
      role: 'Master Carpenter', 
      rating: 4.5, 
      match: '85%', 
      price: '₦40,000', 
      bio: 'Expert carpenter specializing in custom furniture, cabinetry, and structural woodwork.', 
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=150&q=80",
      portfolio: [
        "https://images.unsplash.com/photo-1622021142947-da7ce1119fd8?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1510627802779-3dfe31df72e0?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80"
      ]
    }
  ];

  // Find the specific artisan based on the ID in the URL
  const artisan = artisans.find(a => a.id === parseInt(id));

  if (!artisan) return (
    <div className="main-container">
      <div className="content-area">Artisan not found</div>
    </div>
  );

  return (
    <div className="main-container">
      <div className="content-area">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </div>
          <div style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={bigProfileCircle}>
            <img src={artisan.image} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0 5px' }}>{artisan.name}</h2>
          <p style={{ color: 'var(--primary-green)', fontWeight: '600', margin: 0 }}>{artisan.role}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
            <div style={statItem}><b>{artisan.rating}</b> <span style={{ color: 'var(--primary-purple)' }}>★</span></div>
            <div style={statItem}><b>42</b> Reviews</div>
            <div style={statItem}><b style={{ color: 'var(--primary-purple)' }}>{artisan.match}</b> Match</div>
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
            {artisan.portfolio.map((img, index) => (
              <div key={index} style={galleryItem}>
                <img src={img} alt={`portfolio-${index}`} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit'}} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Footer with Price & Hire */}
      <div style={footerRow}>
        <div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-gray)' }}>Starting from</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-green)' }}>{artisan.price}</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ width: '180px', backgroundColor: 'var(--primary-green)' }}
          onClick={() => navigate('/confirm-order', { state: { artisan } })}
        >
          Hire Now
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const bigProfileCircle = { 
  width: '100px', 
  height: '100px', 
  borderRadius: '50%', 
  backgroundColor: 'var(--bg-light)', 
  margin: '0 auto', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  fontSize: '45px', 
  boxShadow: '0 2px 5px rgba(29, 29, 31, 0.08)',
  border: '1px solid rgba(107, 114, 128, 0.25)'
};
const statItem = { fontSize: '13px', color: 'var(--text-dark)' };
const sectionTitle = { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' };
const galleryGrid = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' };
const galleryItem = { 
  height: '100px', 
  backgroundColor: 'var(--bg-light)', 
  borderRadius: '12px', 
  boxShadow: '0 4px 6px -1px rgba(29, 29, 31, 0.08), 0 2px 4px -1px rgba(29, 29, 31, 0.08)',
  border: '1px solid rgba(107, 114, 128, 0.25)'
};
const footerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px 35px 25px', borderTop: '1px solid rgba(107, 114, 128, 0.15)', marginTop: '20px', backgroundColor: 'var(--bg-white)', boxShadow: '0 -4px 10px rgba(29, 29, 31, 0.05)' };

export default ArtisanProfile;