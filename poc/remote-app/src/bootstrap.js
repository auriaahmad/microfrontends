// src/index.js - Simple Remote App Entry Point (for testing)
import React from "react";
import ReactDOM from "react-dom/client";
import SyncedCounter from "./SyncedCounter";
import UnsyncedCounter from "./UnsyncedCounter";
import LoginComponent from "./LoginComponent";
import { AuthProvider } from "./AuthContext";
import Header from "./Header";

const App = () => (
  <AuthProvider>
    <div style={{ padding: '20px', margin: '0 auto' }}>
      {/* <h1 style={{ color: '#2196F3', marginBottom: '20px' }}>
        🔄 Remote App - Authentication Service
      </h1> */}
      
      <div style={{ marginBottom: '30px' }}>
        <Header />
      </div>
      <div style={{ marginBottom: '30px' }}>
        <LoginComponent />
      </div>
      
      <div style={{ 
        borderTop: '2px solid #eee', 
        paddingTop: '20px',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#666', marginBottom: '15px' }}>
          Other Remote Components:
        </h2>
        <SyncedCounter />
        <br />
        <UnsyncedCounter />
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#e8f5e8',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        color: '#2e7d32'
      }}>
        ✅ Remote app running on localhost:3001 | Components exported via Module Federation
      </div>
    </div>
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);