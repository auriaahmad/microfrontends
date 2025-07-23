<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style() {
		add_editor_style( get_parent_theme_file_uri( 'assets/css/editor-style.css' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues style.css on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	/**
	 * Enqueues style.css on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles() {
		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( 'style.css' ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;

// Secure WordPress Microfrontend Authentication Integration - Fixed Version
function add_secure_wp_auth_scripts() {
    ?>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script>
    // Make React available globally
    window.React = React;
    window.ReactDOM = ReactDOM;
    
    // Set up webpack sharing scope
    window.__webpack_share_scopes__ = window.__webpack_share_scopes__ || {};
    window.__webpack_share_scopes__.default = window.__webpack_share_scopes__.default || {};
    
    window.__webpack_share_scopes__.default.react = {
      "18.0.0": { get: () => () => React, loaded: true }
    };
    window.__webpack_share_scopes__.default["react-dom"] = {
      "18.0.0": { get: () => () => ReactDOM, loaded: true }
    };
    
    window.__webpack_init_sharing__ = window.__webpack_init_sharing__ || (() => Promise.resolve());
    
    // Secure WordPress Authentication State (NO TOKENS)
    let wpAuthState = {
        isAuthenticated: false,
        user: null,
        isLoading: true
        // ✅ No token storage
    };
    
    // Pending API requests tracking
    const pendingRequests = new Map();
    
    // Generate unique request ID
    function generateRequestId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Logging system
    let wpLogs = [];
    
    function addWpLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `${timestamp}: ${message}`;
        wpLogs.push(logMessage);
        
        const logDisplay = document.getElementById('wp-log-display');
        if (logDisplay && logDisplay.style.display !== 'none') {
            logDisplay.innerHTML = wpLogs.join('<br>');
            logDisplay.scrollTop = logDisplay.scrollHeight;
        }
        
        console.log(`🔷 WordPress: ${message}`);
    }
    
    function toggleWpLogs() {
        const logDisplay = document.getElementById('wp-log-display');
        if (logDisplay.style.display === 'none') {
            logDisplay.style.display = 'block';
            logDisplay.innerHTML = wpLogs.join('<br>');
            logDisplay.scrollTop = logDisplay.scrollHeight;
        } else {
            logDisplay.style.display = 'none';
        }
    }
    
    function clearWpLogs() {
        wpLogs = ['WordPress logs cleared...'];
        const logDisplay = document.getElementById('wp-log-display');
        if (logDisplay && logDisplay.style.display !== 'none') {
            logDisplay.innerHTML = wpLogs.join('<br>');
        }
    }
    
    // Secure API request through remote proxy
    async function makeSecureAPIRequest(endpoint, options = {}) {
        if (!wpAuthState.isAuthenticated) {
            throw new Error('Not authenticated - please login first');
        }
        
        const requestId = generateRequestId();
        addWpLog(`📤 Requesting API call: ${endpoint} (ID: ${requestId})`);
        
        return new Promise((resolve, reject) => {
            // Store request handlers
            pendingRequests.set(requestId, { resolve, reject });
            
            // Set timeout
            const timeout = setTimeout(() => {
                pendingRequests.delete(requestId);
                reject(new Error('API request timeout - remote app may not be responding'));
            }, 10000);
            
            // Clear timeout when request completes
            const originalResolve = resolve;
            const originalReject = reject;
            
            pendingRequests.set(requestId, {
                resolve: (result) => {
                    clearTimeout(timeout);
                    originalResolve(result);
                },
                reject: (error) => {
                    clearTimeout(timeout);
                    originalReject(error);
                }
            });
            
            // Send API request to remote app
            const apiRequest = {
                type: 'API_REQUEST',
                payload: {
                    endpoint: endpoint.replace('http://localhost:3002/api', ''), // Strip base URL
                    options: {
                        method: options.method || 'GET',
                        body: options.body,
                        headers: options.headers
                    },
                    requestId
                }
            };
            
            window.postMessage(apiRequest, '*');
            addWpLog(`📨 API request sent (ID: ${requestId})`);
        });
    }
    
    // Secure logout via remote
    function secureLogout() {
        addWpLog('🚪 Initiating secure logout...');
        
        // Clear local state immediately
        wpAuthState = {
            isAuthenticated: false,
            user: null,
            isLoading: false
        };
        
        // Request logout from remote
        window.postMessage({
            type: 'LOGOUT_REQUEST',
            payload: { timestamp: Date.now() }
        }, '*');
        
        // Update UI immediately
        updateWpAuthStatus();
        
        addWpLog('✅ Secure logout completed');
    }
    
    // Test API via secure remote proxy
    async function testSecureWpAPI() {
        const responseDiv = document.getElementById('wp-api-response');
        const errorDiv = document.getElementById('wp-api-error');
        const apiButton = document.getElementById('wp-test-api');
        
        if (!responseDiv || !errorDiv || !apiButton) {
            addWpLog('❌ API testing elements not found');
            return;
        }
        
        responseDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        apiButton.textContent = 'Testing via Remote Proxy...';
        apiButton.disabled = true;
        
        try {
            addWpLog('🧪 Testing API via remote proxy...');
            
            const response = await makeSecureAPIRequest('http://localhost:3002/api/user/profile');
            
            if (response.ok) {
                const data = await response.json();
                
                responseDiv.innerHTML = `
                    <h4 style="color: #28a745; margin: 0 0 10px 0;">✅ Secure API Response (via Remote Proxy):</h4>
                    <div style="background: #e8f5e8; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #2e7d32;">
                        🔒 <strong>Security Notice:</strong> This data was retrieved through the remote app proxy. No tokens were exposed to WordPress.
                    </div>
                    <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; font-size: 14px; overflow: auto; max-height: 300px; border: 1px solid #e0e0e0;">${JSON.stringify(data, null, 2)}</pre>
                `;
                responseDiv.style.display = 'block';
                
                addWpLog('✅ WordPress API test successful');
            } else {
                throw new Error(`API returned status ${response.status}`);
            }
            
        } catch (error) {
            addWpLog(`❌ WordPress API test failed: ${error.message}`);
            
            errorDiv.innerHTML = `
                <h4 style="color: #dc3545; margin: 0 0 10px 0;">❌ WordPress API Error:</h4>
                <div style="background: #ffebee; padding: 15px; border-radius: 4px; border: 1px solid #f44336; color: #721c24;">
                    ${error.message}
                </div>
            `;
            errorDiv.style.display = 'block';
        } finally {
            apiButton.textContent = 'Test WordPress User Profile API (Secure)';
            apiButton.disabled = false;
        }
    }
    
    // Update WordPress auth status UI
    function updateWpAuthStatus() {
        const statusDiv = document.getElementById('wp-auth-status');
        const apiButton = document.getElementById('wp-test-api');
        
        if (!statusDiv || !apiButton) {
            return;
        }
        
        if (wpAuthState.isAuthenticated && wpAuthState.user) {
            statusDiv.innerHTML = `
                <strong>Status:</strong> <span style="color: #28a745;">🟢 Authenticated via Remote</span><br>
                <small><strong>User:</strong> ${wpAuthState.user.username} | <strong>Role:</strong> ${wpAuthState.user.role}</small>
            `;
            statusDiv.style.background = '#d4edda';
            
            apiButton.disabled = false;
            apiButton.style.background = '#28a745';
            apiButton.style.cursor = 'pointer';
            apiButton.onclick = testSecureWpAPI;
            
            addWpLog('✅ WordPress API button activated');
        } else {
            statusDiv.innerHTML = '<strong>Status:</strong> <span style="color: #dc3545;">🔴 Not Authenticated</span>';
            statusDiv.style.background = '#ffebee';
            
            apiButton.disabled = true;
            apiButton.style.background = '#ccc';
            apiButton.style.cursor = 'not-allowed';
            apiButton.onclick = null;
            
            addWpLog('🔒 WordPress API button disabled');
        }
    }
    
    // Initialize secure auth system
    function initializeSecureAuth() {
        addWpLog('🔒 WordPress: Initializing secure auth system...');
        
        // Listen for auth status updates from remote (NO TOKENS)
        window.addEventListener('message', (event) => {
            // Enhanced origin validation
            const allowedOrigins = [
                'http://localhost:3001',  // Remote app
                window.location.origin    // Same origin
            ];
            
            if (!allowedOrigins.includes(event.origin)) {
                console.warn(`⚠️ WordPress: Message from unknown origin: ${event.origin}`);
                return;
            }
            
            if (event.data?.type === 'AUTH_STATUS_UPDATE') {
                const { isAuthenticated, user } = event.data.payload;
                
                addWpLog(`📨 Auth status update from ${event.origin} - ${isAuthenticated ? 'authenticated' : 'not authenticated'}`);
                
                wpAuthState = {
                    isAuthenticated,
                    user,
                    isLoading: false
                    // ✅ No token storage
                };
                
                updateWpAuthStatus();
            }
            
            // Handle API responses from remote
            else if (event.data?.type === 'API_RESPONSE') {
                const { requestId, success, data, error, status } = event.data.payload;
                
                addWpLog(`📥 API response received (ID: ${requestId})`);
                
                const pendingRequest = pendingRequests.get(requestId);
                if (pendingRequest) {
                    pendingRequests.delete(requestId);
                    
                    if (success) {
                        // Create Response-like object
                        const response = {
                            ok: status < 400,
                            status,
                            json: () => Promise.resolve(data),
                            text: () => Promise.resolve(JSON.stringify(data))
                        };
                        pendingRequest.resolve(response);
                    } else {
                        pendingRequest.reject(new Error(error || 'API request failed'));
                    }
                }
            }
        });
        
        // Request initial auth status from remote
        setTimeout(() => {
            addWpLog('🔍 WordPress: Requesting initial auth status...');
            window.postMessage({
                type: 'REQUEST_AUTH_STATUS',
                payload: { timestamp: Date.now() }
            }, '*');
            
            // Fallback timeout
            setTimeout(() => {
                if (wpAuthState.isLoading) {
                    addWpLog('⚠️ WordPress: Auth check timeout');
                    wpAuthState.isLoading = false;
                    updateWpAuthStatus();
                }
            }, 3000);
        }, 500);
    }
    
    // Load WordPress Authentication Components
    async function loadWpComponents() {
        try {
            addWpLog('🚀 Loading WordPress authentication components...');

            // Load remote entry
            await new Promise((resolve, reject) => {
                if (window.remoteCounter) {
                    resolve();
                    return;
                }
                
                const script = document.createElement('script');
                script.src = 'http://localhost:3001/remoteEntry.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });

            // Wait for container
            let attempts = 0;
            while (!window.remoteCounter && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }

            if (!window.remoteCounter) {
                throw new Error('Remote container not found after waiting');
            }

            await window.remoteCounter.init(window.__webpack_share_scopes__.default);

            // Load components
            const authProviderFactory = await window.remoteCounter.get('./AuthProvider');
            const AuthProvider = authProviderFactory().default;

            const loginComponentFactory = await window.remoteCounter.get('./LoginComponent');
            const LoginComponent = loginComponentFactory().default;

            const headerFactory = await window.remoteCounter.get('./Header');
            const Header = headerFactory().default;

            addWpLog('🔐 All components loaded successfully');

            // Render header with Shadow DOM isolation (like original working code)
            const headerDiv = document.getElementById('wp-remote-header');
            if (headerDiv) {
                headerDiv.innerHTML = '';

                // Create Shadow DOM to isolate styles
                const shadowRoot = headerDiv.attachShadow({ mode: 'open' });

                const style = document.createElement('style');
                style.textContent = `
                    :host {
                        all: initial;
                        display: block;
                        font-family: "Times New Roman", serif;
                    }
                    *, *::before, *::after {
                        
                    }
                    div {
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);
                        margin: 20px;
                        width: 100vw;
                        margin: 0;
                        padding: 0;
                    }
                `;
                shadowRoot.appendChild(style);

                const shadowContainer = document.createElement('div');
                shadowRoot.appendChild(shadowContainer);

                const headerRoot = ReactDOM.createRoot(shadowContainer);
                headerRoot.render(
                    React.createElement(Header, {
                        currentPage: getCurrentPage(),
                        onNavigate: (destination) => {
                            if (destination === 'dashboard') {
                                window.location.href = '<?php echo home_url('/remote-component'); ?>';
                            } else if (destination === 'profile') {
                                window.location.href = '<?php echo home_url('/profile'); ?>';
                            }
                        }
                    })
                );
                addWpLog('✅ Remote header rendered with Shadow DOM isolation');
            }

            // Render authentication component with AuthProvider for message handling
            const authDiv = document.getElementById('wp-auth-component');
            if (authDiv) {
                authDiv.innerHTML = '';
                const authRoot = ReactDOM.createRoot(authDiv);
                authRoot.render(
                    React.createElement(AuthProvider, {},
                        React.createElement(LoginComponent)
                    )
                );
                addWpLog('✅ WordPress authentication component rendered');
            }

        } catch (error) {
            addWpLog(`❌ Failed to load WordPress components: ${error.message}`);
            const authDiv = document.getElementById('wp-auth-component');
            if (authDiv) {
                authDiv.innerHTML = `<p style="color: red; padding: 15px; background: #ffebee; border-radius: 4px;">Failed to load authentication: ${error.message}</p>`;
            }
        }
    }
    
    // Get current page for header
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('/remote-component')) return 'dashboard';
        if (path.includes('/profile')) return 'profile';
        return 'dashboard';
    }
    
    // Initialize WordPress authentication system
    function initializeWpAuth() {
        addWpLog('🔷 WordPress secure authentication system starting...');
        
        // Initialize secure auth first
        initializeSecureAuth();
        
        // Update UI if elements exist
        const statusDiv = document.getElementById('wp-auth-status');
        if (statusDiv) {
            updateWpAuthStatus();
        }
        
        // Load authentication components
        setTimeout(loadWpComponents, 1000);
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWpAuth);
    } else {
        setTimeout(initializeWpAuth, 100);
    }
    
    // Make functions globally available
    window.toggleWpLogs = toggleWpLogs;
    window.clearWpLogs = clearWpLogs;
    window.secureLogout = secureLogout;
    
    </script>
    <?php
}
add_action('wp_head', 'add_secure_wp_auth_scripts');

// WordPress Authentication Shortcode - Secure Version
function wp_secure_auth_shortcode() {
    return '
    <div class="wp-auth-microfrontend">
        <!-- Remote Header Container -->
        <div id="wp-remote-header" style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #2196F3, #1976D2); padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <div style="color: white; font-size: 16px;">🔄 Loading Remote Header...</div>
                </div>
            </div>
        </div>
        
        <h2>🔷 WordPress Telecom Authentication System</h2>
        
        <!-- Authentication Container -->
        <div id="wp-auth-component" style="border: 2px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 8px; background: #f9f9f9;">
            <h3>Remote Authentication Component</h3>
            <p>Loading secure authentication from remote app...</p>
        </div>
        
        <!-- WordPress API Testing Container -->
        <div style="border: 2px solid #ff5722; padding: 20px; margin: 20px 0; border-radius: 8px; background: #fff3e0;">
            <h3>🧪 WordPress API Testing (Secure Proxy)</h3>
            <div id="wp-auth-status" style="padding: 10px; background: #ffebee; border-radius: 4px; margin-bottom: 15px;">
                <strong>Status:</strong> <span style="color: #dc3545;">🔴 Not Authenticated</span>
            </div>
            <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #1976d2;">
                🔒 <strong>Security:</strong> All API calls are proxied through the remote app. No direct backend access from WordPress.
            </div>
            <button id="wp-test-api" disabled style="background: #ccc; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: not-allowed; font-size: 16px; font-weight: bold;">
                Test WordPress User Profile API (Secure)
            </button>
            <div id="wp-api-response" style="margin-top: 15px; display: none;"></div>
            <div id="wp-api-error" style="margin-top: 15px; display: none;"></div>
        </div>
        
        <!-- Security Information -->
        <div style="background: #e7f3ff; border: 2px solid #2196F3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2196F3; margin: 0 0 15px 0;">🔒 Security Architecture</h4>
            <ul style="color: #666; margin: 0; line-height: 1.6; padding-left: 20px;">
                <li>✅ API calls proxied through secure remote app</li>
                <li>✅ Authentication managed by remote app only</li>
                <li>✅ JWT tokens never exposed to WordPress</li>
                <li>✅ All communication via secure postMessage API</li>
                <li>✅ Zero direct backend access from WordPress</li>
            </ul>
        </div>
        
        <!-- Activity Logs -->
        <div style="border: 2px solid #6c757d; padding: 20px; margin: 20px 0; border-radius: 8px; background: #f8f9fa;">
            <h3>📋 WordPress Activity Logs</h3>
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <button onclick="toggleWpLogs()" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Toggle Logs
                </button>
                <button onclick="clearWpLogs()" style="background: #666; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Clear Logs
                </button>
            </div>
            <div id="wp-log-display" style="background: #000; color: #00ff00; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; display: none;">
                WordPress secure authentication system initialized...
            </div>
        </div>
    </div>';
}
add_shortcode('wp_auth', 'wp_secure_auth_shortcode');

// WordPress Profile Page Shortcode - Secure Version
function wp_secure_profile_shortcode() {
    return '
    <div id="wp-profile-container">
        <!-- Remote Header Container -->
        <div id="wp-remote-header" style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #2196F3, #1976D2); padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <div style="color: white; font-size: 16px;">🔄 Loading Remote Header...</div>
                </div>
            </div>
        </div>
        
        <div id="wp-profile-content" style="text-align: center; padding: 50px; color: #666;">
            <div style="font-size: 18px; color: #666; margin-bottom: 10px;">
                🔄 Checking authentication status...
            </div>
        </div>
    </div>
    
    <style>
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #2196F3;
        border-radius: 50%;
        animation: wp-spin 1s linear infinite;
        display: inline-block;
        margin-left: 10px;
    }
    
    @keyframes wp-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    </style>
    
    <script>
    // Secure WordPress Profile Authentication Check
    let wpProfileAuthState = {
        isAuthenticated: false,
        user: null,
        isLoading: true
    };
    
    // Load remote components for profile page (with AuthProvider)
    async function loadWpProfileComponents() {
        try {
            console.log("🔷 WordPress Profile: Loading components...");
            
            // Load remote entry if not loaded
            if (!window.remoteCounter) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "http://localhost:3001/remoteEntry.js";
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                
                // Wait for container
                let attempts = 0;
                while (!window.remoteCounter && attempts < 20) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    attempts++;
                }
            }
            
            if (window.remoteCounter) {
                await window.remoteCounter.init(window.__webpack_share_scopes__.default);
                
                // Load AuthProvider and Header
                const authProviderFactory = await window.remoteCounter.get("./AuthProvider");
                const AuthProvider = authProviderFactory().default;
                
                const headerFactory = await window.remoteCounter.get("./Header");
                const Header = headerFactory().default;
                
                // Create hidden AuthProvider for message handling
                const authContainer = document.createElement("div");
                authContainer.style.display = "none";
                document.body.appendChild(authContainer);
                
                const authRoot = ReactDOM.createRoot(authContainer);
                authRoot.render(React.createElement(AuthProvider, {}, 
                    React.createElement("div") // Empty child
                ));
                
                // Render header with Shadow DOM isolation
                const headerDiv = document.getElementById("wp-remote-header");
                if (headerDiv) {
                    headerDiv.innerHTML = "";

                    // Create Shadow DOM to isolate styles
                    const shadowRoot = headerDiv.attachShadow({ mode: "open" });

                    const style = document.createElement("style");
                    style.textContent = `
                        :host {
                            all: initial;
                            display: block;
                            font-family: "Times New Roman", serif;
                        }
                        *, *::before, *::after {
                            
                        }
                        div {
                            position: relative;
                            left: 50%;
                            transform: translateX(-50%);
                            margin: 20px;
                            width: 100vw;
                            margin: 0;
                            padding: 0;
                        }
                    `;
                    shadowRoot.appendChild(style);

                    const shadowContainer = document.createElement("div");
                    shadowRoot.appendChild(shadowContainer);

                    const headerRoot = ReactDOM.createRoot(shadowContainer);
                    headerRoot.render(
                        React.createElement(Header, {
                            currentPage: "profile",
                            onNavigate: (destination) => {
                                if (destination === "dashboard") {
                                    window.location.href = "' . home_url('/remote-component') . '";
                                }
                            }
                        })
                    );
                }
                
                console.log("✅ WordPress Profile: Components loaded with AuthProvider");
            }
        } catch (error) {
            console.error("❌ WordPress Profile: Component loading failed:", error);
        }
    }
    
    // Initialize secure profile auth
    function initializeWpProfileAuth() {
        console.log("🔒 WordPress Profile: Initializing auth...");
        
        // Listen for auth status from remote (NO TOKENS)
        window.addEventListener("message", (event) => {
            // Origin validation
            const allowedOrigins = [
                "http://localhost:3001",
                window.location.origin
            ];
            
            if (!allowedOrigins.includes(event.origin)) {
                return;
            }
            
            if (event.data?.type === "AUTH_STATUS_UPDATE") {
                const { isAuthenticated, user } = event.data.payload;
                
                console.log(`📨 WordPress Profile: Auth status - ${isAuthenticated ? "authenticated" : "not authenticated"}`);
                
                wpProfileAuthState = {
                    isAuthenticated,
                    user,
                    isLoading: false
                };
                
                checkWpProfile();
            }
        });
        
        // Load components first, then request auth status
        loadWpProfileComponents().then(() => {
            setTimeout(() => {
                console.log("🔍 WordPress Profile: Requesting auth status...");
                window.postMessage({
                    type: "REQUEST_AUTH_STATUS",
                    payload: { timestamp: Date.now() }
                }, "*");
                
                // Fallback timeout
                setTimeout(() => {
                    if (wpProfileAuthState.isLoading) {
                        console.log("⚠️ WordPress Profile: Auth check timeout");
                        wpProfileAuthState.isLoading = false;
                        checkWpProfile();
                    }
                }, 3000);
            }, 500);
        });
    }
    
    // Check and display profile
    function checkWpProfile() {
        const profileContent = document.getElementById("wp-profile-content");
        
        if (!profileContent) return;
        
        if (wpProfileAuthState.isLoading) {
            profileContent.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #666;">
                    <div style="font-size: 18px; color: #666; margin-bottom: 10px;">
                        🔄 Checking authentication status...
                    </div>
                    <div class="loading-spinner"></div>
                </div>
            `;
            return;
        }
        
        if (wpProfileAuthState.isAuthenticated && wpProfileAuthState.user) {
            const user = wpProfileAuthState.user;
            
            profileContent.innerHTML = `
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #4CAF50; margin: 0 0 20px 0;">✅ WordPress Profile</h2>
                    <div style="background: #e8f5e8; padding: 10px; border-radius: 4px; margin-bottom: 20px; font-size: 12px; color: #2e7d32;">
                        🔒 <strong>Security Notice:</strong> Profile data retrieved securely through remote authentication system.
                    </div>
                    <div style="display: grid; grid-template-columns: 150px 1fr; gap: 15px; align-items: center; text-align: left;">
                        <strong>Username:</strong>
                        <span>${user.username}</span>
                        <strong>Email:</strong>
                        <span>${user.email || "N/A"}</span>
                        <strong>Role:</strong>
                        <span style="color: white; background: ${user.role === "admin" ? "#ff5722" : "#2196F3"}; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: bold;">
                            ${user.role}
                        </span>
                        <strong>Authentication:</strong>
                        <span style="color: #4CAF50; font-weight: bold;">
                            🔒 Secured via Remote App
                        </span>
                    </div>
                    <div style="margin-top: 25px; padding: 15px; background: #e7f3ff; border-radius: 6px; font-size: 14px; color: #2196F3;">
                        <strong>🔷 WordPress:</strong> Successfully authenticated with remote system via secure messaging.
                    </div>
                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button onclick="window.location.href=\'' . home_url('/remote-component') . '\'" 
                                style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            🏠 Back to Dashboard
                        </button>
                    </div>
                </div>
            `;
        } else {
            profileContent.innerHTML = `
                <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 2px solid #f44336;">
                    <div style="font-size: 64px; margin-bottom: 20px;">🔐</div>
                    <h2 style="color: #f44336; margin-bottom: 15px;">Unauthorized Access</h2>
                    <p style="color: #666; margin-bottom: 20px; font-size: 16px;">
                        You need to be authenticated to access this WordPress profile section.
                    </p>
                    <p style="color: #888; margin-bottom: 25px; font-size: 14px;">
                        Please login first using the authentication component on the dashboard.
                    </p>
                    <button onclick="window.location.href=\'' . home_url('/remote-component') . '\'" 
                            style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                        🏠 Go to Dashboard
                    </button>
                </div>
            `;
        }
    }
    
    // Secure logout for profile page
    function secureWpLogout() {
        wpProfileAuthState = {
            isAuthenticated: false,
            user: null,
            isLoading: false
        };
        
        // Request logout from remote
        window.postMessage({
            type: "LOGOUT_REQUEST",
            payload: { timestamp: Date.now() }
        }, "*");
        
        checkWpProfile();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = "' . home_url('/remote-component') . '";
        }, 1000);
    }
    
    // Make function globally available
    window.secureWpLogout = secureWpLogout;
    
    // Initialize profile auth
    initializeWpProfileAuth();
    </script>';
}
add_shortcode('wp_profile', 'wp_secure_profile_shortcode');
?>