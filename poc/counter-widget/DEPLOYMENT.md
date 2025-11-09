# Counter Widget - VM1 Deployment Guide

This guide covers deploying the counter widget to VM1 (5.175.26.251) so it can be embedded in WordPress and TYPO3 on VM2.

## Prerequisites

- Node.js installed on VM1
- SSH access to VM1
- Ports 3004 open on VM1 firewall

## Deployment Steps

### Step 1: Transfer Files to VM1

From your development machine or VM2:

```bash
# Navigate to your project root
cd D:\MyGitHub\microfrontends

# Copy counter-widget to VM1
scp -r poc/counter-widget username@5.175.26.251:C:/path/to/destination/
```

Or use WinSCP/FileZilla if you prefer a GUI.

### Step 2: SSH into VM1

```bash
ssh username@5.175.26.251
```

### Step 3: Install Dependencies

```bash
cd C:/path/to/counter-widget
npm install
```

This will install:
- React & React-DOM (runtime)
- Webpack & Babel (build tools)
- Express & CORS (server)

### Step 4: Build the Widget

```bash
npm run build
```

This creates `dist/counter-widget.js` - approximately 150KB bundled file containing:
- Your Counter component
- React runtime
- Widget initialization code

### Step 5: Open Firewall Port

In PowerShell as Administrator:

```powershell
New-NetFirewallRule -DisplayName "Counter Widget Server" -Direction Inbound -LocalPort 3004 -Protocol TCP -Action Allow
```

Verify the rule:

```powershell
Get-NetFirewallRule -DisplayName "Counter Widget Server"
```

### Step 6: Start the Server

**Option A: Direct Start (for testing)**

```bash
npm run serve
```

Server will run on http://5.175.26.251:3004

Press Ctrl+C to stop.

**Option B: Production with PM2 (recommended)**

```bash
# Install PM2 globally (one time)
npm install -g pm2

# Start the widget server
pm2 start server.js --name counter-widget

# View logs
pm2 logs counter-widget

# View status
pm2 status

# Stop server
pm2 stop counter-widget

# Restart server
pm2 restart counter-widget

# Delete from PM2
pm2 delete counter-widget
```

**Configure PM2 Auto-Start on Boot:**

```bash
# Save current PM2 configuration
pm2 save

# Generate startup script
pm2 startup

# Follow the instructions shown (will give you a command to run)
```

### Step 7: Verify Deployment

**Test the configuration page:**

Open browser: `http://5.175.26.251:3004`

You should see the Counter Widget code generator interface.

**Test the widget script:**

Open browser: `http://5.175.26.251:3004/dist/counter-widget.js`

You should see minified JavaScript code.

**Test the health endpoint:**

```bash
curl http://5.175.26.251:3004/health
```

Should return:
```json
{
  "status": "ok",
  "service": "Counter Widget Server",
  "version": "1.0.0"
}
```

## Embedding in WordPress (VM2)

### Method 1: Direct HTML Embed

In WordPress post/page editor (Code Editor mode):

```html
<div class="counter-widget"
     data-label="Page Views"
     data-initial="0"
     data-color="#667eea"
     data-size="medium"></div>
<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

### Method 2: WordPress Shortcode

Add to `wp-content/themes/your-theme/functions.php`:

```php
function counter_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'label' => 'Counter',
        'initial' => '0',
        'color' => '#2196F3',
        'size' => 'medium'
    ), $atts);

    static $script_loaded = false;

    $html = sprintf(
        '<div class="counter-widget" data-label="%s" data-initial="%s" data-color="%s" data-size="%s"></div>',
        esc_attr($atts['label']),
        esc_attr($atts['initial']),
        esc_attr($atts['color']),
        esc_attr($atts['size'])
    );

    if (!$script_loaded) {
        $html .= '<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>';
        $script_loaded = true;
    }

    return $html;
}
add_shortcode('counter', 'counter_widget_shortcode');
```

**Usage in posts:**

```
[counter label="Visitors" initial="100" color="#4CAF50" size="large"]
```

## Embedding in TYPO3 (VM2)

Add to your TYPO3 page content element (HTML mode):

```html
<div class="counter-widget"
     data-label="Downloads"
     data-initial="0"
     data-color="#FF9800"
     data-size="medium"></div>

<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

## Multiple Widgets on Same Page

You can have multiple counters with different configurations:

```html
<h2>Statistics Dashboard</h2>

<div class="counter-widget"
     data-label="Total Users"
     data-initial="1250"
     data-color="#2196F3"></div>

<div class="counter-widget"
     data-label="Active Sessions"
     data-initial="42"
     data-color="#4CAF50"></div>

<div class="counter-widget"
     data-label="API Calls"
     data-initial="8760"
     data-color="#FF9800"
     data-size="large"></div>

<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

**Note**: Only include the script tag once per page, even with multiple widgets.

## Updating the Widget

### After Making Changes to Code:

1. **On Development Machine:**
   ```bash
   cd poc/counter-widget
   npm run build
   ```

2. **Transfer updated `dist` folder to VM1:**
   ```bash
   scp dist/counter-widget.js username@5.175.26.251:C:/path/to/counter-widget/dist/
   ```

3. **No server restart needed** - static files are served directly.

### If Server Code Changes (server.js):

```bash
# SSH into VM1
ssh username@5.175.26.251

# Navigate to widget directory
cd C:/path/to/counter-widget

# Restart PM2 process
pm2 restart counter-widget
```

## Troubleshooting

### Widget Not Appearing

**Check browser console for errors:**
- Open browser DevTools (F12)
- Look for CORS errors or 404s

**Common issues:**

1. **Script not loading (404):**
   - Verify: `http://5.175.26.251:3004/dist/counter-widget.js`
   - Check build was successful: `ls dist/` should show `counter-widget.js`
   - Run: `npm run build` if file missing

2. **CORS errors:**
   - Server already configured with `Access-Control-Allow-Origin: *`
   - Should work from any domain

3. **Server not running:**
   ```bash
   # Check if PM2 process is running
   pm2 status

   # Check if port is listening
   netstat -an | findstr 3004
   ```

4. **Firewall blocking:**
   ```powershell
   # Verify firewall rule exists
   Get-NetFirewallRule -DisplayName "Counter Widget Server"
   ```

### Widget Appears but Doesn't Work

**Check React errors in console:**
- Look for JavaScript errors
- Verify widget script loaded completely

**Test with simple example:**

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Counter Widget Test</h1>
    <div id="test-counter"></div>

    <script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
    <script>
        CounterWidget.init('test-counter', {
            label: 'Test Counter',
            initialValue: 0,
            color: '#2196F3',
            size: 'medium'
        });
    </script>
</body>
</html>
```

### Performance Issues

**Bundle size optimization:**

The widget includes full React runtime (~130KB). If size is critical:

1. Use gzip compression (already enabled in Express)
2. Consider CDN hosting for faster delivery
3. Use browser caching (configured in server.js)

**Multiple widgets on same page:**

Each widget creates a separate React root. This is fine for 3-5 widgets, but for 10+ widgets, consider refactoring to use a single React root with multiple Counter components.

## Security Considerations

### Current Configuration

- **CORS**: Open to all origins (`Access-Control-Allow-Origin: *`)
- **No authentication**: Widget is publicly accessible
- **No rate limiting**: Unlimited requests

### For Production

If you need to restrict access:

**Option 1: Whitelist specific domains**

Edit `server.js`:

```javascript
app.use(cors({
  origin: [
    'http://5.175.26.251',
    'http://20.84.85.93',
    'http://yourdomain.com'
  ],
  credentials: false
}));
```

**Option 2: Add API key authentication**

Modify widget to include API key in request headers.

**Option 3: IP whitelisting**

Use Windows Firewall to only allow VM2 IP.

## Monitoring

### View PM2 Logs

```bash
# Real-time logs
pm2 logs counter-widget

# Show last 100 lines
pm2 logs counter-widget --lines 100

# Clear logs
pm2 flush
```

### Monitor Server Resources

```bash
# CPU and memory usage
pm2 monit

# Detailed process info
pm2 show counter-widget
```

## Backup and Restore

### Backup

```bash
# On VM1, create backup
tar -czf counter-widget-backup-$(date +%Y%m%d).tar.gz counter-widget/

# Download to local machine
scp username@5.175.26.251:C:/path/counter-widget-backup-*.tar.gz ./
```

### Restore

```bash
# Upload backup to VM1
scp counter-widget-backup-*.tar.gz username@5.175.26.251:C:/path/

# Extract on VM1
tar -xzf counter-widget-backup-*.tar.gz

# Reinstall dependencies
cd counter-widget
npm install
npm run build
pm2 restart counter-widget
```

## URLs Summary

| Resource | URL |
|----------|-----|
| Code Generator | http://5.175.26.251:3004 |
| Widget Script | http://5.175.26.251:3004/dist/counter-widget.js |
| Health Check | http://5.175.26.251:3004/health |

## Next Steps

1. Visit http://5.175.26.251:3004 on VM2
2. Configure your widget using the visual interface
3. Copy the generated code snippet
4. Paste into WordPress or TYPO3
5. Test and verify widget appears correctly

## Support

For issues or questions:
- Check `poc/counter-widget/README.md` for detailed usage
- Review browser console for errors
- Check PM2 logs: `pm2 logs counter-widget`
- Verify firewall rules and network connectivity
