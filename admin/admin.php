<?php

/**
 * @package     WP Geo
 * @subpackage  Admin Class
 * @author      Ben Huson <ben@thewhiteroom.net>
 */

class WPGeo_Admin {
	
	/**
	 * Properties
	 */
	var $editor;
	var $settings;
	
	/**
	 * Constructor
	 */
	function WPGeo_Admin() {
		global $wpgeo;
		$this->include_admin_files();
		
		// Register Settings
		if ( function_exists( 'register_setting' ) ) {
			register_setting( 'wp-geo-options', 'wp_geo_options', '' );
		}
		
		// Only show editor if Google API Key valid
		if ( $wpgeo->passed_api_checks() ) {
			$this->editor = new WPGeo_Editor();
			$this->editor->add_buttons();
		}
		$this->dismiss_version_upgrade_msg();
		
		// Show Settings Link
		$this->settings = new WPGeo_Settings();
		
		add_action( 'admin_notices', array( $this, 'version_upgrade_msg' ) );
	}
	
	/**
	 * Include Admin Files
	 */
	function include_admin_files() {
		include_once( WPGEO_DIR . 'admin/editor.php' );
		include_once( WPGEO_DIR . 'admin/dashboard.php' );
		include_once( WPGEO_DIR . 'admin/settings.php' );
	}
	
	/**
	 * Version upgrade message
	 */
	function version_upgrade_msg() {
		$wp_geo_show_version_msg = get_option( 'wp_geo_show_version_msg' );
		if ( current_user_can( 'manage_options' ) && $wp_geo_show_version_msg == 'Y' ) {
			$dismiss_url = wp_nonce_url( add_query_arg( 'wpgeo_action', 'dismiss-update-msg', $_SERVER['PHP_SELF'] ), 'wpgeo_dismiss_update_msg' );
			echo '<div id="wpgeo_version_message" class="error below-h2" style="margin:5px 15px 2px 0px;">
					<p>' . __( 'WP Geo has been updated to use the WordPress widgets API. You will need to re-add your widgets.', 'wp-geo' ) . ' <a href="' . $dismiss_url . '">' .  __( 'Dismiss', 'wp-geo' ) . '</a></p>
				</div>';
		}
	}
	
	/**
	 * Dismiss version upgrade message
	 */
	function dismiss_version_upgrade_msg() {
		if ( isset( $_GET['wpgeo_action'] ) && $_GET['wpgeo_action'] = 'dismiss-update-msg' ) {
			if ( wp_verify_nonce( $_GET['_wpnonce'], 'wpgeo_dismiss_update_msg' ) ) {
				update_option( 'wp_geo_show_version_msg', 'N' );
				$url = remove_query_arg( 'wpgeo_action', $_SERVER['PHP_SELF'] );
				$url = remove_query_arg( '_wpnonce', $url );
				wp_redirect( $url );
				exit();
			}
		}
	}
	
}

?>