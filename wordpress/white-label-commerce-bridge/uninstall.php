<?php
defined('WP_UNINSTALL_PLUGIN') || exit;
// Preserve products, orders and all WooCommerce settings.
delete_option('wlcb_settings');
