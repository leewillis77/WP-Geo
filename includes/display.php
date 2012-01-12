<?php



/**
 * @package     WP Geo
 * @subpackage  Display Class
 * @author      Ben Huson <ben@thewhiteroom.net>
 */



class WPGeo_Display {
	
	
	
	/**
	 * Properties
	 */
	
	var $maps;
	var $n = 0;
	
	
	
	/**
	 * @method       Constructor
	 * @description  Initialise the class.
	 */
	
	function WPGeo_Display() {
		
		$this->maps = array();
		
	}
	
	
	
	/**
	 * @method       Get ID
	 * @description  Gets the ID of this display instance.
	 */
	
	function getID() {
		
		$this->n++;
		return $this->n;
		
	}
	
	
	
	/**
	 * @method       Add Map
	 * @description  Add map to maps array.
	 * @parameter    $args = Map configuration
	 */
	
	function addMap( $args ) {
		
		$this->maps[] = $args;
		
	}
	
	
	
	/**
	 * @method       Render
	 * @description  Outputs the javascript to display the maps.
	 */
	
	function render() {
		
		if ( count( $this->maps ) > 0 ) {
			foreach ( $this->maps as $map ) {
				$m = new WPGeo_Map( $map['id'] );
				$m->addGeoXMLURL( $map['rss'] );
				echo $m->renderMapJS();
			}
		}
		
	}
	
	
	
	/**
	 * @method       Shortcode [wpgeo]
	 * @description  Used to manually display a map in a post.
	 * @parameter    $atts = Array of attributes
	 * @parameter    $content = Content between tags
	 * @return       (string) HTML Output
	 */
	
	function shortcode_wpgeo( $atts, $content = null ) {
	
		$allowed_atts = array(
			'rss' => null,
			'kml' => null
		);
		extract(shortcode_atts($allowed_atts, $atts));
		
		if ( $kml != null ) {
			$rss = $kml;
		}
		
		if ( $rss != null ) {
			$id = $this->getID();
			$map = array(
				'id' => $id,
				'rss' => $rss
			);
			$this->addMap($map);
			$wp_geo_options = get_option('wp_geo_options');
			return apply_filters( 'wpgeo_map', '', array(
				'id'      => 'wp_geo_map_' . $id,
				'classes' => array( 'wpgeo', 'wpgeo-rss' ),
				'width'   => $wp_geo_options['default_map_width'],
				'height'  => $wp_geo_options['default_map_height'],
				'content' => $rss
			) );
		}
		
		return '';
		
	}
	
	
	
}



// Create the display instance
$wpgeo_display = new WPGeo_Display();



// Hooks
add_action( 'wp_footer', array( $wpgeo_display, 'render' ) );
add_shortcode( 'wpgeo', array( $wpgeo_display, 'shortcode_wpgeo' ) );



?>