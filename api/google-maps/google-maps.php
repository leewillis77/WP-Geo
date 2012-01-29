<?php

class WPGeo_API_GoogleMaps {
	
	/**
	 * Constructor
	 */
	function WPGeo_API_GoogleMaps() {
		add_filter( 'wpgeo_wp_head_js', array( $this, 'wpgeo_wp_head_js' ), 5 );
		add_filter( 'wpgeo_map', array( $this, 'wpgeo_map' ), 5, 2 );
		add_filter( 'wpgeo_static_map_url', array( $this, 'wpgeo_static_map_url' ), 5, 2 );
		add_filter( 'wpgeo_map_link', array( $this, 'wpgeo_map_link' ), 5, 2 );
		add_filter( 'wpgeo_marker_javascript', array( $this, 'wpgeo_marker_javascript' ), 5, 2 );
		add_filter( 'wpgeo_wp_enqueue_scripts', array( $this, 'wpgeo_wp_enqueue_scripts' ), 5, 2 );
		add_filter( 'wpgeo_admin_enqueue_scripts', array( $this, 'wpgeo_admin_enqueue_scripts' ), 5, 2 );
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
		wp_register_script( 'wpgeo-api-googlemaps', WPGEO_URL . 'api/google-maps/google-maps.js', array( 'jquery' ), '1.1' );
		wp_enqueue_script( 'wpgeo-api-googlemaps' );
	}
	
	/**
	 * Enqueue WP Geo Admin Scripts
	 */
	function wpgeo_admin_enqueue_scripts() {
		wp_register_script( 'wpgeo-api-googlemaps-admin', WPGEO_URL . 'api/google-maps/admin.js', array( 'jquery', 'wpgeo-admin-post' ), '1.1' );
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
	
}

global $WPGeo_API_GoogleMaps;
$WPGeo_API_GoogleMaps = new WPGeo_API_GoogleMaps();

?>