
/**
 * WP Geo Google Maps Admin
 * JavaScript for Google Maps API interface when editing posts and pages.
 */

var WPGeo_API_GoogleMaps_Admin = {

	// Vars
	map:      null,
	geocoder: null,
	marker:   null,
	
	// DOM Ready
	ready : function() {
		var api = WPGeo_API_GoogleMaps_Admin;
		
		// Lat/Lng fields updated
		jQuery("#wp_geo_map").bind('wpgeo_admin_map_updated_lat_lng_fields', function(e, data) {
			if (data.latitude == '' || data.longitude == '') {
				api.marker.hide();
			} else {
				var point = new GLatLng(data.latitude, data.longitude);
				api.map.setCenter(point);
				api.marker.setPoint(point);
				api.marker.show();
			}
		});
		
		// Lat/Lng fields cleared
		jQuery("#wp_geo_map").bind('wpgeo_admin_map_clear_location_fields', function(e, data) {
			api.marker.hide();
		});
		
		// Center location
		jQuery("#wp_geo_map").bind('wpgeo_admin_map_center_location', function(e, data) {
			api.map.setCenter(api.marker.getLatLng());
		});
		
		// Admin location center
		jQuery("#wp_geo_map").bind('wpgeo_admin_map_center_location', function(e, data) {
			api.map.setCenter(api.marker.getLatLng());
		});
		
		// Admin map search
		jQuery("#wp_geo_map").bind('wpgeo_admin_map_search', function(e, data) {
			var geocoder = new GClientGeocoder();
			
			// Set default base country for search
			if (data.base_country_code) {
				geocoder.setBaseCountryCode(data.base_country_code);
			}
			
			if (geocoder) {
				geocoder.getLatLng(
					data.address,
					function(point) {
						if (!point) {
							alert(data.address + " not found");
						} else {
							api.map.setCenter(point);
							api.marker.setPoint(point);
							api.marker.show();
							// Notify WP Geo of new coords
							jQuery("#wp_geo_map").trigger("wpgeo_admin_update_lat_lng", {
								latitude  : point.lat(),
								longitude : point.lng()
							});
						}
					}
				);
			}
		});
		
		// Init admin map
		jQuery("#wp_geo_map").bind('wpgeo_admin_map', function(e, data) {
			if (GBrowserIsCompatible()) {
				var api = WPGeo_API_GoogleMaps_Admin;
				var center = new GLatLng(data.center_latitude, data.center_longitude);
				var point = new GLatLng(data.latitude, data.longitude);
				
				api.map = new GMap2(document.getElementById(jQuery(this).attr('id')));
				api.map.setCenter(center, data.zoom);
				api.map.addMapType(G_PHYSICAL_MAP);
				api.map.addControl(new GLargeMapControl3D());
				api.map.addControl(new GMapTypeControl());
				
				api.marker = new GMarker(point, {draggable: true});
				
				var zoom_setting = document.getElementById("wpgeo_map_settings_zoom");
				zoom_setting.value = data.zoom;
				
				// @todo How can we do this without eval()?
				api.map.setMapType(eval(data.maptype));
				var type_setting = document.getElementById("wpgeo_map_settings_type");
				type_setting.value = WPGeo_API_GoogleMaps_Admin.getMapTypeContentFromUrlArg(api.map.getCurrentMapType().getUrlArg());
				
				GEvent.addListener(api.map, "click", function(overlay, latlng) {
					jQuery("#wp_geo_map").trigger("wpgeo_admin_update_lat_lng", {
						latitude  : latlng.lat(),
						longitude : latlng.lng()
					});
					api.marker.setPoint(latlng);
					api.marker.show();
				});
				
				GEvent.addListener(api.map, "maptypechanged", function() {
					var type_setting = document.getElementById("wpgeo_map_settings_type");
					type_setting.value = WPGeo_API_GoogleMaps_Admin.getMapTypeContentFromUrlArg(api.map.getCurrentMapType().getUrlArg());
				});
				
				GEvent.addListener(api.map, "zoomend", function(oldLevel, newLevel) {
					var zoom_setting = document.getElementById("wpgeo_map_settings_zoom");
					zoom_setting.value = newLevel;
				});
				
				GEvent.addListener(api.map, "moveend", function() {
					var center = this.getCenter();
					var centre_setting = document.getElementById("wpgeo_map_settings_centre");
					centre_setting.value = center.lat() + "," + center.lng();
				});
				
				GEvent.addListener(api.marker, "dragstart", function() {
					api.map.closeInfoWindow();
				});
				
				GEvent.addListener(api.marker, "dragend", function() {
					var coords = api.marker.getLatLng();
					jQuery("#wp_geo_map").trigger("wpgeo_admin_update_lat_lng", {
						latitude  : coords.lat(),
						longitude : coords.lng()
					});
				});
				
				// Old PHP filter, need a need JS version?
				//' . apply_filters( 'wpgeo_map_js_preoverlays', '', 'map' ) . '
				
				api.map.addOverlay(api.marker);
				
				if (data.hide_marker) {
					api.marker.hide();
				}
				api.map.checkResize();
			}
			// Avoid memory leaks
			jQuery(window).unload( GUnload );
		});
		
	},
	
	// Get the Google Map type from a URL parameter
	function getMapTypeContentFromUrlArg( arg ) {
		
		if ( arg == G_NORMAL_MAP.getUrlArg() ) {
			return "G_NORMAL_MAP";
		} else if ( arg == G_SATELLITE_MAP.getUrlArg() ) {
			return "G_SATELLITE_MAP";
		} else if ( arg == G_HYBRID_MAP.getUrlArg() ) {
			return "G_HYBRID_MAP";
		} else if ( arg == G_PHYSICAL_MAP.getUrlArg() ) {
			return "G_PHYSICAL_MAP";
		} else if ( arg == G_MAPMAKER_NORMAL_MAP.getUrlArg() ) {
			return "G_MAPMAKER_NORMAL_MAP";
		} else if ( arg == G_MAPMAKER_HYBRID_MAP.getUrlArg() ) {
			return "G_MAPMAKER_HYBRID_MAP";
		} else if ( arg == G_MOON_ELEVATION_MAP.getUrlArg() ) {
			return "G_MOON_ELEVATION_MAP";
		} else if ( arg == G_MOON_VISIBLE_MAP.getUrlArg() ) {
			return "G_MOON_VISIBLE_MAP";
		} else if ( arg == G_MARS_ELEVATION_MAP.getUrlArg() ) {
			return "G_MARS_ELEVATION_MAP";
		} else if ( arg == G_MARS_VISIBLE_MAP.getUrlArg() ) {
			return "G_MARS_VISIBLE_MAP";
		} else if ( arg == G_MARS_INFRARED_MAP.getUrlArg() ) {
			return "G_MARS_INFRARED_MAP";
		} else if ( arg == G_SKY_VISIBLE_MAP.getUrlArg() ) {
			return "G_SKY_VISIBLE_MAP";
		} else if ( arg == G_SATELLITE_3D_MAP.getUrlArg() ) {
			return "G_SATELLITE_3D_MAP";
		} else if ( arg == G_DEFAULT_MAP_TYPES.getUrlArg() ) {
			return "G_DEFAULT_MAP_TYPES";
		} else if ( arg == G_MAPMAKER_MAP_TYPES.getUrlArg() ) {
			return "G_MAPMAKER_MAP_TYPES";
		} else if ( arg == G_MOON_MAP_TYPES.getUrlArg() ) {
			return "G_MOON_MAP_TYPES";
		} else if ( arg == G_MARS_MAP_TYPES.getUrlArg() ) {
			return "G_MARS_MAP_TYPES";
		} else if ( arg == G_SKY_MAP_TYPES.getUrlArg() ) {
			return "G_SKY_MAP_TYPES";
		}
		
		return "";
		
	}
	
}

// Wait for DOM ready...
jQuery(document).ready(function() {
	WPGeo_API_GoogleMaps_Admin.ready();
});

