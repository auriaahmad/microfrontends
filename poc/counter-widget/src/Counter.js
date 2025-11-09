import React, { useState } from 'react';

const Counter = ({ initialValue = 0, label = 'Counter', color = '#2196F3', size = 'medium' }) => {
  const [count, setCount] = useState(initialValue);

  const sizes = {
    small: { fontSize: '14px', padding: '8px 16px', containerPadding: '15px' },
    medium: { fontSize: '16px', padding: '10px 20px', containerPadding: '20px' },
    large: { fontSize: '20px', padding: '12px 24px', containerPadding: '25px' }
  };

  const currentSize = sizes[size] || sizes.medium;

  const styles = {
    container: {
      display: 'inline-block',
      padding: currentSize.containerPadding,
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      border: `2px solid ${color}`,
      minWidth: '200px'
    },
    label: {
      fontSize: currentSize.fontSize,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    display: {
      fontSize: `calc(${currentSize.fontSize} * 2)`,
      fontWeight: 'bold',
      color: color,
      margin: '15px 0',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: `1px solid ${color}`
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center'
    },
    button: {
      backgroundColor: color,
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '60px'
    },
    resetButton: {
      backgroundColor: '#ff5722',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.label}>{label}</div>
      <div style={styles.display}>{count}</div>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => setCount(count - 1)}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          −
        </button>
        <button
          style={styles.resetButton}
          onClick={() => setCount(initialValue)}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          Reset
        </button>
        <button
          style={styles.button}
          onClick={() => setCount(count + 1)}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
