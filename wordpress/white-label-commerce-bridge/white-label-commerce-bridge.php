<?php
/**
 * Plugin Name: White Label Commerce Bridge
 * Description: Store-independent configuration and strict frontend-origin access for WooCommerce Store API.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Requires Plugins: woocommerce
 * License: GPL-2.0-or-later
 * Text Domain: white-label-commerce-bridge
 */

defined('ABSPATH') || exit;

final class WLCB_Bridge {
    const OPTION = 'wlcb_settings';

    public static function boot() {
        add_action('admin_menu', array(__CLASS__, 'menu'));
        add_action('admin_init', array(__CLASS__, 'settings'));
        add_action('admin_notices', array(__CLASS__, 'dependency_notice'));
        add_action('rest_api_init', array(__CLASS__, 'routes'));
        add_filter('rest_pre_dispatch', array(__CLASS__, 'guard'), 10, 3);
        // Run after WordPress's permissive REST CORS handler; only override our scopes.
        add_filter('rest_pre_serve_request', array(__CLASS__, 'cors'), 20, 4);
    }

    public static function options() {
        return wp_parse_args(get_option(self::OPTION, array()), array('enabled' => false, 'origins' => array()));
    }

    public static function origin($value) {
        $value = trim((string) $value);
        $parts = wp_parse_url($value);
        if (!$parts || empty($parts['scheme']) || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment']) || (!empty($parts['path']) && '/' !== $parts['path'])) {
            return '';
        }
        $scheme = strtolower($parts['scheme']);
        $host = strtolower($parts['host']);
        if ('https' !== $scheme && !('http' === $scheme && in_array($host, array('localhost', '127.0.0.1', '[::1]'), true))) {
            return '';
        }
        if (false !== strpos($host, '*')) { return ''; }
        $port = isset($parts['port']) ? (int) $parts['port'] : null;
        $suffix = $port && !(('https' === $scheme && 443 === $port) || ('http' === $scheme && 80 === $port)) ? ':' . $port : '';
        return $scheme . '://' . $host . $suffix;
    }

    public static function sanitize($input) {
        $input = is_array($input) ? $input : array();
        $origins = array();
        $lines = isset($input['origins']) && is_string($input['origins']) ? preg_split('/\R/', $input['origins']) : array();
        foreach ($lines as $line) {
            if ('' === trim($line)) { continue; }
            $origin = self::origin($line);
            if (!$origin) {
                add_settings_error(self::OPTION, 'invalid_origin', 'Invalid origin omitted. Use HTTPS origins without paths or wildcards. HTTP is allowed only for localhost.');
                continue;
            }
            $origins[] = $origin;
        }
        return array('enabled' => !empty($input['enabled']), 'origins' => array_values(array_unique($origins)));
    }

    public static function menu() {
        add_submenu_page('woocommerce', 'Commerce Bridge', 'Commerce Bridge', 'manage_options', 'wlcb', array(__CLASS__, 'page'));
    }

    public static function settings() {
        register_setting('wlcb', self::OPTION, array('type' => 'array', 'sanitize_callback' => array(__CLASS__, 'sanitize'), 'show_in_rest' => false));
    }

    public static function page() {
        if (!current_user_can('manage_options')) { return; }
        $options = self::options();
        ?>
        <div class="wrap">
            <h1>White Label Commerce Bridge</h1>
            <p>Connect any storefront to this WooCommerce installation. No consumer secret is required in the browser.</p>
            <?php settings_errors(); ?>
            <form method="post" action="options.php">
                <?php settings_fields('wlcb'); ?>
                <p><label><input type="checkbox" name="wlcb_settings[enabled]" value="1" <?php checked($options['enabled']); ?>> Enable frontend bridge</label></p>
                <p><label for="wlcb-origins">Allowed frontend origins (one per line)</label></p>
                <textarea id="wlcb-origins" name="wlcb_settings[origins]" rows="6" class="large-text code" placeholder="https://shop.example.com"><?php echo esc_textarea(implode("\n", $options['origins'])); ?></textarea>
                <p>Exact origins only, including port when applicable. Do not enter product URLs, paths or wildcards.</p>
                <?php submit_button(); ?>
            </form>
            <p>Public configuration: <code><?php echo esc_html(rest_url('wlcb/v1/config')); ?></code></p>
            <p>Store API: <code><?php echo esc_html(rest_url('wc/store/v1/')); ?></code></p>
            <p>Prices, taxes, coupons, shipping and payments remain controlled by WooCommerce. Payment gateways must support Store API checkout.</p>
        </div>
        <?php
    }

    public static function dependency_notice() {
        if (current_user_can('manage_options') && !class_exists('WooCommerce')) {
            echo '<div class="notice notice-error"><p>White Label Commerce Bridge requires an active WooCommerce installation.</p></div>';
        }
    }

    public static function routes() {
        register_rest_route('wlcb/v1', '/config', array(
            'methods' => 'GET',
            'permission_callback' => array(__CLASS__, 'available'),
            'callback' => array(__CLASS__, 'config'),
        ));
    }

    public static function available() {
        if (!self::options()['enabled']) { return new WP_Error('wlcb_disabled', 'Commerce bridge is disabled.', array('status' => 503)); }
        if (!class_exists('WooCommerce')) { return new WP_Error('wlcb_unavailable', 'WooCommerce is unavailable.', array('status' => 503)); }
        return true;
    }

    private static function scoped($request) {
        return 1 === preg_match('#^/(?:wlcb/v1|wc/store/v1)(?:/|$)#', $request->get_route());
    }

    private static function allowed($origin) {
        $normalized = self::origin($origin);
        return $normalized && (self::origin(home_url()) === $normalized || in_array($normalized, self::options()['origins'], true));
    }

    public static function guard($result, $server, $request) {
        if (!self::options()['enabled'] || !self::scoped($request)) { return $result; }
        $origin = $request->get_header('origin');
        // Origin is a browser boundary, not authentication. Native clients can omit it.
        if ($origin && !self::allowed($origin)) {
            return new WP_Error('wlcb_origin_denied', 'Frontend origin is not allowed.', array('status' => 403));
        }
        return $result;
    }

    public static function cors($served, $result, $request, $server) {
        if (!self::options()['enabled'] || !self::scoped($request)) { return $served; }
        header_remove('Access-Control-Allow-Origin');
        header_remove('Access-Control-Allow-Credentials');
        header_remove('Access-Control-Allow-Headers');
        header_remove('Access-Control-Allow-Methods');
        header_remove('Access-Control-Expose-Headers');
        header('Vary: Origin', false);
        $origin = $request->get_header('origin');
        if ($origin && self::allowed($origin)) {
            header('Access-Control-Allow-Origin: ' . self::origin($origin));
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Cart-Token, Nonce, X-WC-Store-API-Nonce');
            header('Access-Control-Expose-Headers: Cart-Token, Nonce, Nonce-Timestamp, X-WP-Total, X-WP-TotalPages, Retry-After');
        }
        if (preg_match('#^/wc/store/v1/(cart|checkout|order)(?:/|$)#', $request->get_route())) {
            header('Cache-Control: private, no-store, max-age=0');
        }
        return $served;
    }

    public static function config() {
        return rest_ensure_response(array(
            'schema_version' => 1,
            'plugin_version' => '1.0.0',
            'store' => array(
                'name' => get_bloginfo('name'),
                'url' => home_url('/'),
                'locale' => get_locale(),
                'currency' => get_woocommerce_currency(),
                'currency_minor_unit' => wc_get_price_decimals(),
                'prices_include_tax' => wc_prices_include_tax(),
                'shipping_countries' => WC()->countries->get_shipping_countries(),
            ),
            'api' => array('store_api' => rest_url('wc/store/v1/'), 'cart_auth' => 'Cart-Token'),
            'checkout' => array(
                'guest_checkout_enabled' => 'yes' === get_option('woocommerce_enable_guest_checkout'),
                'payment_methods_source' => 'cart.payment_methods',
                'gateway_compatibility' => 'Must be verified per installed gateway on staging.',
            ),
        ));
    }
}

WLCB_Bridge::boot();
