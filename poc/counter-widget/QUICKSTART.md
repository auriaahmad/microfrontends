# Counter Widget - Quick Start Guide

Get your counter widget running in 3 minutes!

## Local Testing (VM2 or Development Machine)

### 1. Install Dependencies

```bash
cd poc/counter-widget
npm install
```

### 2. Build the Widget

```bash
npm run build
```

### 3. Start the Server

```bash
npm run serve
```

### 4. Open Your Browser

Visit: **http://localhost:3004**

You'll see the code generator interface where you can:
- Configure widget options (label, color, size, initial value)
- See live preview
- Generate embed code
- Copy and paste into any website

### 5. Test the Widget

Open `test.html` in your browser:

**Option A: Via Server**
- Visit: http://localhost:3004/test.html

**Option B: Open Directly**
- Navigate to `poc/counter-widget/test.html`
- Open in browser

You should see multiple counter widgets with different configurations.

## VM1 Deployment (Production)

### Quick Deploy Script

```bash
# On VM1
cd /path/to/counter-widget

# Install, build, and start
npm install && npm run build && npm run serve
```

### With PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start server
pm2 start server.js --name counter-widget

# Save configuration
pm2 save

# Auto-start on boot
pm2 startup
```

### Open Firewall

```powershell
# Windows PowerShell (as Administrator)
New-NetFirewallRule -DisplayName "Counter Widget Server" -Direction Inbound -LocalPort 3004 -Protocol TCP -Action Allow
```

### Access from VM2

Visit: **http://5.175.26.251:3004**

## Embedding Examples

### WordPress - HTML Block

```html
<div class="counter-widget"
     data-label="Page Views"
     data-initial="0"
     data-color="#667eea"
     data-size="medium"></div>
<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

### TYPO3 - HTML Content Element

```html
<div class="counter-widget"
     data-label="Downloads"
     data-color="#4CAF50"></div>
<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

### Any Website - Direct Embed

```html
<!DOCTYPE html>
<html>
<body>
    <h1>My Page</h1>

    <div class="counter-widget"
         data-label="Counter"
         data-initial="10"
         data-color="#2196F3"></div>

    <script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
</body>
</html>
```

## Configuration Options

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-label` | Any text | `"Counter"` | Label displayed above counter |
| `data-initial` | Number | `0` | Starting count value |
| `data-color` | Hex color | `"#2196F3"` | Primary color (buttons, border) |
| `data-size` | `small`, `medium`, `large` | `"medium"` | Widget size |

## Troubleshooting

### Widget Not Showing?

1. **Check browser console** (F12) for errors
2. **Verify script loads**: http://5.175.26.251:3004/dist/counter-widget.js
3. **Ensure build completed**: Check `dist/counter-widget.js` exists
4. **Rebuild if needed**: `npm run build`

### Server Not Starting?

```bash
# Check if port 3004 is in use
netstat -an | findstr 3004

# Kill process if needed (Windows)
taskkill /F /PID <process_id>
```

### Changes Not Appearing?

```bash
# Rebuild the widget
npm run build

# Hard refresh browser
Ctrl + Shift + R (Chrome/Firefox)
Ctrl + F5 (Edge)
```

## File Structure

```
counter-widget/
├── src/
│   ├── Counter.js           # React component
│   └── widget.js            # Initialization
├── public/
│   └── index.html           # Code generator
├── dist/
│   └── counter-widget.js    # Built bundle ← This is what you embed
├── server.js                # Express server
├── test.html                # Test page
└── package.json
```

## URLs Reference

| Resource | Local | VM1 Production |
|----------|-------|----------------|
| Code Generator | http://localhost:3004 | http://5.175.26.251:3004 |
| Widget Script | http://localhost:3004/dist/counter-widget.js | http://5.175.26.251:3004/dist/counter-widget.js |
| Test Page | http://localhost:3004/test.html | http://5.175.26.251:3004/test.html |
| Health Check | http://localhost:3004/health | http://5.175.26.251:3004/health |

## Next Steps

1. ✅ Build and test locally
2. ✅ Deploy to VM1
3. ✅ Configure firewall
4. ✅ Generate embed code
5. ✅ Embed in WordPress/TYPO3
6. ✅ Customize colors and labels

## Full Documentation

- **README.md** - Complete feature documentation
- **DEPLOYMENT.md** - Detailed deployment guide with troubleshooting
- **test.html** - Working examples

## Support

**Common Commands:**

```bash
npm run build        # Build widget
npm run dev          # Build with watch mode
npm run serve        # Start server
pm2 status           # Check PM2 status
pm2 logs counter-widget  # View logs
```

That's it! Your counter widget is ready to embed anywhere. 🚀
