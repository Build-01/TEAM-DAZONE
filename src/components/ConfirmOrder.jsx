import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the artisan data passed from the profile page
  const artisan = location.state?.artisan || { name: 'Artisan', price: '₦0', role: 'Professional' };

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '850px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Confirm Order</h2>
      </div>

      {/* Order Summary Card */}
      <div style={summaryCard}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-gray)', marginBottom: '15px' }}>Project Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: '500' }}>Service</span>
          <span style={{ color: 'var(--primary-purple)', fontWeight: '600' }}>{artisan.role}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: '500' }}>Artisan</span>
          <span>{artisan.name}</span>
        </div>
        <div style={{ borderTop: '1px dashed #eee', margin: '15px 0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Total Amount</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--primary-purple)' }}>{artisan.price}</span>
        </div>
      </div>

      {/* Escrow Notice Box */}
      <div style={escrowBox}>
        <div style={{ fontSize: '24px', marginRight: '15px' }}>🛡️</div>
        <div>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold' }}>SabiWork Escrow Protection</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.4' }}>
            Your payment will be held securely. We only release funds to <b>{artisan.name}</b> once you confirm the work is completed to your satisfaction.
          </p>
        </div>
      </div>

      {/* Payment Method Selector (Simplified) */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Payment Method</h3>
        <div style={paymentOption}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-purple)' }}></div>
            </div>
            <span style={{ fontWeight: '600' }}>Bank Transfer / Card</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>Secure via Paystack</span>
        </div>
      </div>

      {/* Final Action Button */}
      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <button 
          className="btn-primary" 
          style={{ backgroundColor: 'var(--primary-purple)', height: '60px', fontSize: '18px' }}
          onClick={() => {
            alert(`Order confirmed with ${artisan.name}!`);
            navigate('/dashboard');
          }}
        >
          Pay {artisan.price} Securely
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-gray)', marginTop: '15px' }}>
          By clicking pay, you agree to the Project Contract Terms.
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---
const summaryCard = {
  padding: '20px',
  borderRadius: '20px',
  backgroundColor: '#f9fafb',
  border: '1px solid #f3f4f6',
  marginBottom: '25px'
};

const escrowBox = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: '#f0fdf4', // Soft green to imply safety
  border: '1px solid #dcfce7',
  marginBottom: '25px'
};

const paymentOption = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  borderRadius: '12px',
  border: '2px solid var(--primary-purple)',
  backgroundColor: '#fdfdff'
};

export default ConfirmOrder;