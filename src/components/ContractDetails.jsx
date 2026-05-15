import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ContractDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="main-container">
      
      {/* 1. FIXED HEADER */}
      <div style={headerArea}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dark)" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Contract Details</h2>
        </div>

        <div style={contractHeader}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '17px' }}>POP Ceiling Installation</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-gray)' }}>Artisan: <b>Adekunle Jones</b></p>
          </div>
          <div>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: 'rgba(244, 183, 64, 0.15)', color: 'var(--primary-purple)' }}>In Progress</span>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="content-area">
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

        {/* Work Feed */}
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '25px 0 15px' }}>Project Updates</h4>
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

      {/* 3. FIXED FOOTER ACTION */}
      <div style={footerAction}>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-gray)', marginBottom: '15px', padding: '0 10px' }}>
          Only release funds once the job is fully completed.
        </p>
        <button 
          className="btn-primary"
          style={{ margin: 0 }}
          onClick={() => {
            toast.success('Funds released successfully!');
            navigate('/dashboard');
          }}
        >
          Release Funds
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---
const headerArea = { padding: '40px 20px 10px', borderBottom: '1px solid rgba(107, 114, 128, 0.15)', backgroundColor: 'var(--bg-white)' };

const footerAction = { 
  padding: '20px 25px 35px 25px', 
  borderTop: '1px solid rgba(107, 114, 128, 0.15)', 
  backgroundColor: 'var(--bg-white)',
  marginTop: 'auto',
  boxShadow: '0 -4px 10px rgba(29, 29, 31, 0.05)'
};

const contractHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };

const stepperContainer = { padding: '10px 5px' };
const stepRow = { display: 'flex', alignItems: 'center', gap: '15px' };
const stepCircleActive = { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-green)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const stepCircle = { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-light)', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' };
const stepLineActive = { width: '2px', height: '30px', backgroundColor: 'var(--primary-green)', marginLeft: '13px' };
const stepLine = { width: '2px', height: '30px', backgroundColor: 'var(--bg-light)', marginLeft: '13px' };
const stepTitle = { margin: 0, fontSize: '14px', fontWeight: 'bold' };
const stepTitleInactive = { margin: 0, fontSize: '14px', color: '#6b7280' };
const stepDate = { margin: 0, fontSize: '12px', color: 'var(--text-gray)' };

const updateCard = { padding: '15px', borderRadius: '12px', backgroundColor: 'var(--bg-white)', border: '1px solid rgba(107, 114, 128, 0.15)' };
const photoPlaceholder = { width: '60px', height: '60px', backgroundColor: 'var(--bg-light)', borderRadius: '8px', border: '1px solid rgba(107, 114, 128, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };

export default ContractDetails;