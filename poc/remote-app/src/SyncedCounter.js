import React, { useState, useEffect } from "react";

const SyncedCounter = () => {
  const [count, setCount] = useState(0);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const websocket = new WebSocket('ws://localhost:8080');
    
    websocket.onopen = () => {
      console.log('SyncedCounter: Connected to WebSocket');
      setWs(websocket);
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'COUNTER_UPDATE') {
          setCount(data.value);
        }
      } catch (error) {
        console.error('SyncedCounter: Error parsing message:', error);
      }
    };
    
    websocket.onclose = () => {
      console.log('SyncedCounter: WebSocket connection closed');
    };
    
    return () => {
      websocket.close();
    };
  }, []);

  const updateCounter = (newValue) => {
    setCount(newValue);
    
    // Send update to WebSocket server
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'COUNTER_UPDATE',
        value: newValue,
        source: 'remote'
      }));
    }
  };

  const increment = () => updateCounter(count + 1);
  const decrement = () => updateCounter(count - 1);

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px' }}>
      <h3>Synced Counter (Cross-Browser)</h3>
      <div style={{ fontSize: '24px', margin: '20px 0', fontWeight: 'bold' }}>
        Count: {count}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={decrement}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
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
            backgroundColor: '#28a745', 
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

export default SyncedCounter;