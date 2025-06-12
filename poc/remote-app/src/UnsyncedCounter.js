import React, { useState } from "react";

const UnsyncedCounter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div style={{ padding: '20px', border: '2px solid #6c757d', borderRadius: '8px' }}>
      <h3>Unsynced Counter (Local Only)</h3>
      <div style={{ fontSize: '24px', margin: '20px 0', fontWeight: 'bold' }}>
        Count: {count}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={decrement}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Decrease (-1)
        </button>
        <button 
          onClick={increment}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Increase (+1)
        </button>
      </div>
    </div>
  );
};

export default UnsyncedCounter;