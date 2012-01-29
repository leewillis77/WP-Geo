
/**
 * WP Geo Admin Post
 * JavaScript for the WP Geo Maps interface when editing posts and pages.
 */

var WPGeo_Admin = {
	
	// DOM Loaded
	ready : function() {
		
		// Latitude field updated
		jQuery("#wp_geo_latitude").keyup(function() {
			WPGeo_Admin.updatedLatLngFields();
		});
		
		// Longitude field updated
		jQuery("#wp_geo_longitude").keyup(function() {
			WPGeo_Admin.updatedLatLngFields();
		});
		
		// Clear location fields
		jQuery("#wpgeo_location a.wpgeo-clear-location-fields").click(function(e) {
			jQuery("input#wp_geo_search").val('');
			jQuery("input#wp_geo_latitude").val('');
			jQuery("input#wp_geo_longitude").val('');
			jQuery("#wp_geo_map").trigger("wpgeo_admin_map_clear_location_fields", {});
			return false;
		});
		
		// Centre Location
		jQuery("#wpgeo_location a.wpgeo-centre-location").click(function(e) {
			jQuery("#wp_geo_map").trigger("wpgeo_admin_map_center_location", {});
			return false;
		});
		
		// Location search
		jQuery("#wpgeo_location #wp_geo_search_button").click(function(e) {
			var latitude  = jQuery("input#wp_geo_latitude").val();
			var longitude = jQuery("input#wp_geo_longitude").val();
			var address   = jQuery("input#wp_geo_search").val();
			var base_country_code = null;
			
			if ( jQuery("input#wp_geo_base_country_code").length > 0 ) {
				base_country_code = jQuery("input#wp_geo_base_country_code").val();
			}
			
			jQuery("#wp_geo_map").trigger("wpgeo_admin_map_search", {
				latitude          : jQuery("input#wp_geo_latitude").val(),
				longitude         : jQuery("input#wp_geo_longitude").val(),
				address           : jQuery("input#wp_geo_search").val(),
				base_country_code : jQuery("input#wp_geo_base_country_code").val()
			});
			
			return false;
		});
		
		// Prevent enter from submitting post, just search
		jQuery(window).keydown(function(e){
			if (jQuery("#wpgeo_location input:focus").length > 0) {
				if (e.keyCode == 13) {
					jQuery("#wpgeo_location #wp_geo_search_button").trigger("click");
					e.preventDefault();
					return false;
				}
			}
		});
		
		// Admin map search result
		// Listens for results from API
		jQuery("#wp_geo_map").bind('wpgeo_admin_update_lat_lng', function(e, data) {
			jQuery("input#wp_geo_latitude").val(data.latitude);
			jQuery("input#wp_geo_longitude").val(data.longitude);
		});
		
	},
	
	// Lat/Lng fields Updated
	updatedLatLngFields : function() {
		jQuery("#wp_geo_map").trigger("wpgeo_admin_map_updated_lat_lng_fields", {
			latitude:  jQuery("input#wp_geo_latitude").val(),
			longitude: jQuery("input#wp_geo_longitude").val()
		});
	}
	
}

// Wait for DOM ready...
jQuery(document).ready(function() {
	WPGeo_Admin.ready();
});
