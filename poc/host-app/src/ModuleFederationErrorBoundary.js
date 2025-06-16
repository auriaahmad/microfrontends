// src/ModuleFederationErrorBoundary.js - Host App
import React from 'react';

class ModuleFederationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('Module Federation Error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Check if it's a module federation error
    const isModuleFederationError = 
      error?.message?.includes('Loading script failed') ||
      error?.message?.includes('remoteEntry.js') ||
      error?.message?.includes('ScriptExternalLoadError');

    if (isModuleFederationError) {
      console.warn(`🔌 Remote module "${this.props.moduleName}" is unavailable. Showing fallback.`);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      const { moduleName = "Remote Module", fallback } = this.props;
      
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div style={{ 
          padding: '20px', 
          border: '2px dashed #ff9800', 
          borderRadius: '8px',
          backgroundColor: '#fff3e0',
          margin: '10px 0',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#f57c00', margin: '0 0 15px 0' }}>
            🔌 {moduleName} Unavailable
          </h3>
          
          <p style={{ color: '#e65100', margin: '0 0 15px 0' }}>
            The remote application is currently offline or unreachable.
          </p>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            margin: '15px 0',
            border: '1px solid #ffcc02'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#ef6c00' }}>
              🛠️ Possible Solutions:
            </h4>
            <ul style={{ textAlign: 'left', color: '#d84315', margin: '0', paddingLeft: '20px' }}>
              <li>Start the remote app server (port 3001)</li>
              <li>Check if the remote app is running</li>
              <li>Verify network connectivity</li>
              <li>Check for CORS issues</li>
            </ul>
          </div>

          <div style={{ marginTop: '15px' }}>
            <button 
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Retry ({this.state.retryCount})
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔃 Refresh Page
            </button>
          </div>

          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '20px', 
              textAlign: 'left',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#666' }}>
                🐛 Error Details (Development)
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                color: '#333',
                overflow: 'auto',
                margin: '10px 0 0 0'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModuleFederationErrorBoundary;