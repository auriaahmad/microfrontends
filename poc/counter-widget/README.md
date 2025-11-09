# Counter Widget - Standalone Embeddable Component

A standalone, embeddable counter widget built with React that can be embedded anywhere using a simple script tag.

## Features

- 🎨 Fully customizable (label, color, size, initial value)
- 🚀 Zero dependencies for embedding (React bundled internally)
- 📦 Single script tag integration
- 🔧 Visual code generator interface
- 🌐 Works on any website (WordPress, TYPO3, plain HTML)
- ⚡ Auto-init or manual initialization options

## Quick Start

### 1. Install Dependencies

```bash
cd poc/counter-widget
npm install
```

### 2. Build the Widget

```bash
npm run build
```

This creates `dist/counter-widget.js` - the standalone widget file.

### 3. Start the Server

```bash
npm run serve
```

The server will start on `http://localhost:3004`

## Development

### Watch Mode (Auto-rebuild on changes)

```bash
npm run dev
```

Keep this running in one terminal while making changes to the widget code.

### Available Scripts

- `npm run build` - Build production bundle
- `npm run dev` - Build in development mode with watch
- `npm run serve` - Start the Express server

## Deployment to VM1 (5.175.26.251)

### Step 1: Transfer Files

Copy the entire `counter-widget` directory to VM1:

```bash
# On your local machine or VM2
scp -r poc/counter-widget username@5.175.26.251:/path/to/destination/
```

### Step 2: Install Dependencies on VM1

```bash
# SSH into VM1
ssh username@5.175.26.251

# Navigate to widget directory
cd /path/to/counter-widget

# Install dependencies
npm install
```

### Step 3: Build on VM1

```bash
npm run build
```

### Step 4: Configure Firewall (if needed)

```powershell
# On VM1 (Windows PowerShell as Administrator)
New-NetFirewallRule -DisplayName "Counter Widget Server" -Direction Inbound -LocalPort 3004 -Protocol TCP -Action Allow
```

### Step 5: Start the Server

```bash
npm run serve
```

Or use PM2 for production (keeps server running):

```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start server.js --name counter-widget

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Step 6: Access the Configuration Page

Visit `http://5.175.26.251:3004` to access the code generator interface.

## Usage

### Method 1: Auto-Init (Easiest)

Add this code anywhere in your HTML:

```html
<!-- Counter Widget - Auto Init -->
<div class="counter-widget"
     data-label="My Counter"
     data-initial="0"
     data-color="#2196F3"
     data-size="medium"></div>
<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

The widget will automatically initialize on all elements with class `counter-widget`.

### Method 2: Manual Init

Add this code for more control:

```html
<!-- Counter Widget - Manual Init -->
<div id="my-counter"></div>
<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
<script>
  CounterWidget.init('my-counter', {
    label: 'My Counter',
    initialValue: 10,
    color: '#FF5722',
    size: 'large'
  });
</script>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | string | `'Counter'` | Label text displayed above counter |
| `initialValue` | number | `0` | Starting count value |
| `color` | string | `'#2196F3'` | Primary color (buttons, border) |
| `size` | string | `'medium'` | Size: `'small'`, `'medium'`, or `'large'` |

### Multiple Widgets on Same Page

You can have multiple widgets with different configurations:

```html
<!-- Auto-init multiple widgets -->
<div class="counter-widget" data-label="Visitors" data-color="#4CAF50"></div>
<div class="counter-widget" data-label="Clicks" data-initial="100" data-color="#FF9800"></div>
<div class="counter-widget" data-label="Sales" data-color="#E91E63" data-size="large"></div>

<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

## Embedding in CMS

### WordPress

**Option 1: Using WordPress Editor**

1. Switch to "Code Editor" mode
2. Paste the widget code where you want it

**Option 2: Using PHP Template**

```php
// In your theme template file
<div class="counter-widget"
     data-label="Page Views"
     data-color="#667eea"></div>

<?php
// Enqueue the widget script
wp_enqueue_script('counter-widget', 'http://5.175.26.251:3004/dist/counter-widget.js', array(), '1.0.0', true);
?>
```

**Option 3: Shortcode**

Add to your theme's `functions.php`:

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

Usage in posts/pages:
```
[counter label="My Counter" initial="50" color="#FF5722" size="large"]
```

### TYPO3

Add to your TYPO3 template or content element:

```html
<div class="counter-widget"
     data-label="Counter"
     data-initial="0"
     data-color="#2196F3"></div>

<script src="http://5.175.26.251:3004/dist/counter-widget.js"></script>
```

## Code Generator

Visit the configuration page at `http://5.175.26.251:3004` to:

1. Customize your widget visually
2. See live preview
3. Generate code snippets
4. Copy and paste directly into your website

## Architecture

```
counter-widget/
├── src/
│   ├── Counter.js       # React counter component
│   └── widget.js        # Widget initialization & global API
├── public/
│   └── index.html       # Code generator interface
├── dist/
│   └── counter-widget.js # Built bundle (created by webpack)
├── server.js            # Express server
├── webpack.config.js    # Webpack configuration
└── package.json         # Dependencies and scripts
```

## Technical Details

- **Bundler**: Webpack 5
- **React Version**: 18.2.0
- **Output Format**: UMD (Universal Module Definition)
- **Server**: Express.js with CORS enabled
- **Bundle Size**: ~150KB (includes React)

## Troubleshooting

### Widget Not Appearing

1. Check browser console for errors
2. Verify script URL is accessible: `http://5.175.26.251:3004/dist/counter-widget.js`
3. Ensure widget is built: `npm run build`
4. Check CORS settings if embedding from different domain

### Script Blocked by CORS

The server is configured with `Access-Control-Allow-Origin: *` by default. If you need to restrict origins, modify `server.js`:

```javascript
app.use(cors({
  origin: ['http://yourdomain.com', 'http://anotherdomain.com'],
  credentials: false
}));
```

### Port Already in Use

Change the port in `server.js`:

```javascript
const PORT = 3004; // Change to any available port
```

## License

MIT
