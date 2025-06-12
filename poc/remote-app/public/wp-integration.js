window.loadCounter = async function(elementId) {
  try {
    console.log("Loading counter for:", elementId);
    
    // Check if React is available
    if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
      console.error("React not loaded");
      return;
    }

    // Use the global webpack container
    await __webpack_init_sharing__("default");
    const container = window.remoteCounter;
    await container.init(__webpack_share_scopes__.default);
    
    // Get the Counter module
    const factory = await container.get("./Counter");
    const Counter = factory().default;
    
    // Render the component
    const containerElement = document.getElementById(elementId);
    if (containerElement) {
      const root = ReactDOM.createRoot(containerElement);
      root.render(React.createElement(Counter));
      console.log("Counter loaded successfully!");
    }
  } catch (error) {
    console.error("Failed to load counter:", error);
    
    // Fallback: Create a simple counter manually
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; border: 2px solid #007bff; border-radius: 8px;">
          <h2>Fallback Counter</h2>
          <div style="font-size: 24px; margin: 20px 0; font-weight: bold;">
            Count: <span id="count-${elementId}">0</span>
          </div>
          <button onclick="updateCount('${elementId}', -1)" 
                  style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; margin-right: 10px;">
            Decrease (-1)
          </button>
          <button onclick="updateCount('${elementId}', 1)" 
                  style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px;">
            Increase (+1)
          </button>
        </div>
      `;
    }
  }
};

window.updateCount = function(elementId, change) {
  const countElement = document.getElementById("count-" + elementId);
  if (countElement) {
    const currentCount = parseInt(countElement.textContent) || 0;
    countElement.textContent = currentCount + change;
  }
};