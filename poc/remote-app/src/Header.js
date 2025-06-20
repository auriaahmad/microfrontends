// src/Header.js - Remote App (Updated with consistent styling)
import React from 'react';

const Header = ({ currentPage, onNavigate }) => {
  return (
    <header style={{ 
      textAlign: 'center', 
      marginBottom: '30px', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: '100%', // Ensure full width
      boxSizing: 'border-box' // Include padding in width calculation
    }}>
      <h1 style={{ 
        color: '#333', 
        margin: '0 0 10px 0',
        fontSize: '2.5em'
      }}>
        🏠 Telecom Network Performance Application
      </h1>
      <p style={{ 
        color: '#666', 
        margin: '0 0 15px 0',
        fontSize: '1.1em'
      }}>
        End-to-End Network Engineering & Data Pipeline Management Dashboard
      </p>
      
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            backgroundColor: currentPage === 'dashboard' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🏠 Dashboard
        </button>
        <button 
          onClick={() => onNavigate('profile')}
          style={{
            backgroundColor: currentPage === 'profile' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          👤 Profile
        </button>
      </div>
      
      <div style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#4CAF50',
        fontStyle: 'italic'
      }}>
        ✅ Header loaded from Remote App
      </div>
    </header>
  );
};

export default Header;