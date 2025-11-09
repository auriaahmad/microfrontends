# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Webpack Module Federation** proof-of-concept demonstrating secure micro-frontend architecture with JWT authentication. The project consists of four main components:

1. **Host App** (port 3000) - Main application shell that consumes remote components
2. **Remote App** (port 3001) - Authentication provider that exposes secure components via Module Federation
3. **WebSocket Server** (port 3002/8080) - Backend providing JWT authentication and WebSocket state synchronization
4. **Counter Widget** (port 3004) - Standalone embeddable widget that can be integrated anywhere via script tag

## Architecture Highlights

### Security Model
- **Token Isolation**: JWT access tokens are NEVER shared between apps. Only the remote app stores and manages tokens.
- **API Proxy Pattern**: Host app makes API requests through secure `postMessage` communication with the remote app, which acts as a proxy.
- **Auth Status Sharing**: Only authentication status and user metadata (username, email, role) are shared with host apps.

### Module Federation Configuration
- **Host App** (`poc/host-app/webpack.config.js:32-41`):
  - Consumes remote components from `remoteCounter@http://localhost:3001/remoteEntry.js`
  - Shared dependencies: React, React-DOM (singleton mode)

- **Remote App** (`poc/remote-app/webpack.config.js:37-61`):
  - Exposes: `SyncedCounter`, `UnsyncedCounter`, `AuthProvider`, `LoginComponent`, `Header`
  - Shared dependencies: React, React-DOM (singleton mode, no version requirements)

### Communication Patterns
- **postMessage API**: Used for secure cross-app communication
- **Message Types**:
  - `AUTH_STATUS_UPDATE`: Remote → Host (auth status changes)
  - `REQUEST_AUTH_STATUS`: Host → Remote (request current auth status)
  - `API_REQUEST`: Host → Remote (proxied API calls with requestId)
  - `API_RESPONSE`: Remote → Host (API responses with requestId)

### Key Files
- `poc/host-app/src/JWTContext.js:1-136` - Host app auth status consumer & API request proxy
- `poc/remote-app/src/AuthContext.js:1-359` - Remote app auth provider & secure API proxy
- `poc/host-app/src/bootstrap.js:1-276` - Host app main component with routing
- `poc/websocket-server/server.js:1-275` - Express + WebSocket server with JWT auth

## Development Commands

### Starting the Applications

**IMPORTANT**: Start all three applications in separate terminal windows in this order:

1. **WebSocket/Auth Server** (must start first):
```bash
cd poc/websocket-server
npm install  # First time only
npm start    # Runs on ports 3002 (HTTP) and 8080 (WebSocket)
```

2. **Remote App** (authentication provider):
```bash
cd poc/remote-app
npm install  # First time only
npm start    # Runs on http://localhost:3001
```

3. **Host App** (main application):
```bash
cd poc/host-app
npm install  # First time only
npm start    # Runs on http://localhost:3000
```

### Starting the Counter Widget

The counter widget runs independently and doesn't require the other apps:

```bash
cd poc/counter-widget
npm install     # First time only
npm run build   # Build the widget bundle
npm run serve   # Runs on http://localhost:3004
```

Access the code generator at `http://localhost:3004`

### Test Credentials
Default users configured in `poc/websocket-server/server.js:25-40`:
- **Admin**: username: `admin`, password: `password123`
- **Engineer**: username: `engineer`, password: `password123`

## CMS Integration Scripts

### TYPO3 Integration
Located in `poc/typo3_scripts/`:
- `dashboard_typo3.txt` - Dashboard page integration script
- `prof_typo3.txt` - Profile page integration script

These scripts demonstrate how to embed the micro-frontend components into TYPO3 pages using iframe and postMessage communication.

### WordPress Integration
Located in `poc/wordpress_scripts/`:
- `functions.php` - WordPress theme functions for micro-frontend integration
- `functions_remote.php` - Updated version for VM deployment (uses VM1 IP: 5.175.26.251)

### Counter Widget
Located in `poc/counter-widget/`:
- **Standalone embeddable widget** that can be integrated anywhere using a simple script tag
- Visual configuration interface with code generator
- Two integration methods: auto-init (declarative) and manual init (programmatic)
- See `poc/counter-widget/README.md` for complete documentation

## Technical Constraints

### Bootstrap Pattern
Both apps use async bootstrap pattern (`index.js` imports `bootstrap.js`) to ensure proper Module Federation loading sequence.

### CORS Configuration
- Remote app allows all origins in development (`Access-Control-Allow-Origin: *`)
- WebSocket server has CORS enabled for cross-origin requests

### Token Lifecycle
- **Access Token**: 15 minutes expiry, stored only in memory in remote app
- **Refresh Token**: 7 days expiry, stored in localStorage only in remote app
- **Auto-refresh**: Configured at 14 minutes (before expiration) in `poc/remote-app/src/AuthContext.js:262-272`

## Routing

Host app implements simple client-side routing:
- `/` - Dashboard page (TelecomDashboard component)
- `/profile` - Protected profile page (requires authentication)

Routing is managed via browser History API without React Router in the host app.

## Common Development Patterns

### Adding New Remote Components
1. Export component in `poc/remote-app/webpack.config.js` under `exposes`
2. Import in host app using: `import("remoteCounter/ComponentName")`
3. Handle async loading with try-catch and loading states

### Making Authenticated API Calls from Host
Use `makeAuthenticatedRequest` from JWTContext:
```javascript
const { makeAuthenticatedRequest } = useJWT();
const response = await makeAuthenticatedRequest('/user/profile');
const data = await response.json();
```

### Adding New Backend Endpoints
Add routes in `poc/websocket-server/server.js`:
- Public routes: Standard Express routes
- Protected routes: Use `authenticateToken` middleware (line 68-86)

## Known Limitations

- No TypeScript (vanilla JavaScript + React)
- No automated tests configured
- Plain text passwords in demo (use bcrypt in production)
- Hardcoded JWT secrets (change in production)
- Single WebSocket server instance (no clustering)
