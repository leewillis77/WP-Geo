<?php

class WPGeo_API_GoogleMaps {
	
	/**
	 * Constructor
	 */
	function WPGeo_API_GoogleMaps() {
		add_action( 'init', array( $this, 'init_api' ) );
		add_filter( 'wpgeo_wp_head_js', array( $this, 'wpgeo_wp_head_js' ), 5 );
		add_filter( 'wpgeo_map', array( $this, 'wpgeo_map' ), 5, 2 );
		add_filter( 'wpgeo_static_map_url', array( $this, 'wpgeo_static_map_url' ), 5, 2 );
		add_filter( 'wpgeo_map_link', array( $this, 'wpgeo_map_link' ), 5, 2 );
		add_filter( 'wpgeo_marker_javascript', array( $this, 'wpgeo_marker_javascript' ), 5, 2 );
		add_filter( 'wpgeo_wp_enqueue_scripts', array( $this, 'wpgeo_wp_enqueue_scripts' ), 5, 2 );
		add_filter( 'wpgeo_admin_enqueue_scripts', array( $this, 'wpgeo_admin_enqueue_scripts' ), 5, 2 );
		add_filter( 'wpgeo_api_checks', array( $this, 'check_google_api_key' ) );
		add_filter( 'wpgeo_api_error_message', array( $this, 'google_api_error_message' ) );
	}
	
	/**
	 * Init API
	 */
	function init_api() {
		$locale = $this->get_googlemaps_locale( '&hl=' );
		wp_register_script( 'googlemaps', 'http://maps.google.com/maps?file=api&v=2' . $locale . '&key=' . $this->get_google_api_key() . '&sensor=false', false, '2' );
		wp_register_script( 'wpgeo-api-googlemaps-admin', WPGEO_URL . 'api/google-maps/admin.js', array( 'jquery', 'googlemaps', 'wpgeo-admin-post' ), '1.1' );
	}
	
	/**
	 * WP Head JavaScript
	 */
	function wpgeo_wp_head_js( $value ) {
		$value .= 'GEvent.addDomListener(window, "unload", GUnload);';
		return $value;
	}
	
	/**
	 * Enqueue WP Geo Scripts
	 */
	function wpgeo_wp_enqueue_scripts() {
		wp_enqueue_script( 'googlemaps' );
		wp_enqueue_script( 'wpgeo-api-googlemaps' );
	}
	
	/**
	 * Enqueue WP Geo Admin Scripts
	 */
	function wpgeo_admin_enqueue_scripts() {
		wp_enqueue_script( 'googlemaps' );
		wp_enqueue_script( 'wpgeo-api-googlemaps-admin' );
	}
	
	/**
	 * Map
	 */
	function wpgeo_map( $map, $args ) {
		$wp_geo_options = get_option( 'wp_geo_options' );
		$args = wp_parse_args( $args, array(
			'id'      => 'wpgeo-map',
			'classes' => array( 'wpgeo-map' ),
			'styles'  => array(),
			'width'   => $wp_geo_options['default_map_width'],
			'height'  => $wp_geo_options['default_map_height'],
			'content' => ''
		) );
		return '<div id="' . $args['id'] . '" class="' . implode( ' ', $args['classes'] ) . '" style="width:' . wpgeo_css_dimension( $args['width'] ) . '; height:' . wpgeo_css_dimension( $args['height'] ) . '; ' . implode( '; ', $args['styles'] ) . '">' . $args['content'] . '</div>';
	}
	
	/**
	 * Map Static Map URL
	 */
	function wpgeo_static_map_url( $url, $args ) {
		$sensor = $args['sensor'] ? 'true' : 'false';
		$url = 'http://maps.googleapis.com/maps/api/staticmap?';
		$url .= 'center=' . $args['center']->latitude . ',' . $args['center']->longitude;
		$url .= '&zoom=' . $args['zoom'];
		$url .= '&size=' . $args['width'] . 'x' . $args['height'];
		$url .= '&maptype=' . $args['maptype'];
		$url .= '&markers=color:red%7C' . $args['coords']->latitude . ',' . $args['coords']->longitude;
		$url .= '&sensor=' . $sensor;
		return $url;
	}
	
	/**
	 * Map Link
	 */
	function wpgeo_map_link( $url, $args ) {
		$q = 'q=' . $args['latitude'] . ',' . $args['longitude'];
		$z = $args['zoom'] ? '&z=' . $args['zoom'] : '';
		return 'http://maps.google.co.uk/maps?' . $q . $z;
	}
	
	/**
	 * Marker JavaScript
	 */
	function wpgeo_marker_javascript( $js, $marker ) {
		return "WPGeo_API_GoogleMaps.createIcon(" . $marker->width . ", " . $marker->height . ", " . $marker->anchorX . ", " . $marker->anchorY . ", '" . $marker->image . "', '" . $marker->shadow . "')";
	}
	
	/**
	 * Check Google API Key has been entered.
	 *
	 * @return (boolean)
	 */
	function check_google_api_key() {
		$api_key = $this->get_google_api_key();
		if ( empty( $api_key ) || ! isset( $api_key ) ) {
			return false;
		}
		return true;
	}
	
	/**
	 * Get Google API Key
	 * Gets the Google API Key. Passes it through a filter
	 * so it can be overriden by another plugin.
	 *
	 * @return (string) API Key
	 */
	function get_google_api_key() {
		$wp_geo_options = get_option( 'wp_geo_options' );
		return apply_filters( 'wpgeo_google_api_key', $wp_geo_options['google_api_key'] );
	}
	
	/**
	 * API Error Message
	 * Displayed if API Key not set.
	 *
	 * @return (string) Error message
	 */
	function google_api_error_message() {
		return __( 'Before you can use WP Geo you must acquire a <a href="http://code.google.com/apis/maps/signup.html">Google API Key</a> for your blog - the plugin will not function without it!', 'wp-geo' );
	}
	
	/**
	 * Get Google Maps Locale
	 * See http://code.google.com/apis/maps/faq.html#languagesupport
	 * for link to updated languages codes.
	 * props Alain Messin, tweaked by Ben :)
	 *
	 * @param        $before = Before output
	 * @param        $after = After output
	 * @return       (string) Google locale
	 * @todo         Move to external API
	 */
	function get_googlemaps_locale( $before = '', $after = '' ) {
		$l = get_locale();
		if ( ! empty( $l ) ) {
			
			// WordPress locale is xx_XX, some codes are known by google
			// with - in place of _ , so replace
			$l = str_replace( '_', '-', $l );
			
			// Known Google codes known
			$codes = array(
				'en-AU',
				'en-GB',
				'pt-BR',
				'pt-PT',
				'zh-CN',
				'zh-TW'
			);
			
			// Other codes known by googlemaps are 2 characters codes
			if ( ! in_array( $l, $codes ) )
				$l = substr( $l, 0, 2 );
		}
		
		// Apply filter - why not ;)
		$l = apply_filters( 'wp_geo_locale', $l );
		
		if ( ! empty( $l ) )
			$l = $before . $l . $after;
		
		return $l;
	}
	
}

global $WPGeo_API_GoogleMaps;
$WPGeo_API_GoogleMaps = new WPGeo_API_GoogleMaps();

?>