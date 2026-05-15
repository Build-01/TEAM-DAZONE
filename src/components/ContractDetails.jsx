import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ContractDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // To identify which contract we are viewing

  return (
    <div className="main-container" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '850px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Contract Details</h2>
      </div>

      {/* Contract Summary Header */}
      <div style={contractHeader}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>POP Ceiling Installation</h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-gray)' }}>Artisan: <b>Adekunle Jones</b></p>
        </div>
        <div style={statusBadge}>In Progress</div>
      </div>

      {/* Progress Stepper */}
      <div style={stepperContainer}>
        <div style={stepRow}>
          <div style={stepCircleActive}>✓</div>
          <div style={{ flex: 1 }}>
            <p style={stepTitle}>Contract Started</p>
            <p style={stepDate}>May 12, 2026</p>
          </div>
        </div>
        <div style={stepLineActive}></div>
        <div style={stepRow}>
          <div style={stepCircleActive}>2</div>
          <div style={{ flex: 1 }}>
            <p style={stepTitle}>Materials Purchased</p>
            <p style={stepDate}>May 14, 2026</p>
          </div>
        </div>
        <div style={stepLine}></div>
        <div style={stepRow}>
          <div style={stepCircle}>3</div>
          <div style={{ flex: 1 }}>
            <p style={stepTitleInactive}>Work Completed</p>
            <p style={stepDate}>Pending</p>
          </div>
        </div>
      </div>

      {/* Work Feed / Evidence */}
      <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Project Updates</h4>
        
        <div style={updateCard}>
          <p style={{ fontSize: '13px', margin: '0 0 10px 0' }}>
            <b>Adekunle</b> uploaded 2 photos of the materials purchased.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={photoPlaceholder}>📦</div>
            <div style={photoPlaceholder}>🧾</div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-gray)', marginTop: '10px', display: 'block' }}>Yesterday, 2:45 PM</span>
        </div>
      </div>

      {/* Release Funds Action */}
      <div style={footerAction}>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-gray)', marginBottom: '15px' }}>
          Only release funds once the job is fully completed.
        </p>
        <button 
          className="btn-primary" 
          style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }} 
          disabled
        >
          Release Funds (Locked)
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const contractHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6', marginBottom: '20px' };
const statusBadge = { padding: '6px 12px', borderRadius: '20px', backgroundColor: '#eef2ff', color: 'var(--primary-purple)', fontSize: '12px', fontWeight: 'bold' };

const stepperContainer = { padding: '10px 5px' };
const stepRow = { display: 'flex', alignItems: 'center', gap: '15px' };
const stepCircleActive = { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const stepCircle = { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const stepLineActive = { width: '2px', height: '30px', backgroundColor: 'var(--primary-purple)', marginLeft: '13px' };
const stepLine = { width: '2px', height: '30px', backgroundColor: '#f3f4f6', marginLeft: '13px' };
const stepTitle = { margin: 0, fontSize: '14px', fontWeight: 'bold' };
const stepTitleInactive = { margin: 0, fontSize: '14px', color: '#9ca3af' };
const stepDate = { margin: 0, fontSize: '12px', color: 'var(--text-gray)' };

const updateCard = { padding: '15px', borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' };
const photoPlaceholder = { width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };
const footerAction = { padding: '20px 0', borderTop: '1px solid #f3f4f6', marginTop: 'auto' };

export default ContractDetails;