


/**
* ----- WP Geo Admin Post -----
* JavaScript for the WP Go Google Maps interface
* when editing posts and pages.
*/



var map = null;
var geocoder = null;
var marker = null;



function wpgeo_updatedLatLngFields() {

	var latitude  = jQuery("input#wp_geo_latitude").val();
	var longitude = jQuery("input#wp_geo_longitude").val();
	
	if ( latitude == '' || longitude == '' ) {
		marker.hide();
	} else {
		var point = new GLatLng(latitude, longitude);
		map.setCenter(point);
		marker.setPoint(point);
		marker.show();
	}
	
}



jQuery(document).ready(function() {
	
	// Init admin map
	jQuery("#wp_geo_map").bind('wpgeo_init_admin_map', function(e, data) {
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById(jQuery(this).attr('id')));
			var center = new GLatLng(data.center_latitude, data.center_longitude);
			var point = new GLatLng(data.latitude, data.longitude);
			map.setCenter(center, data.zoom);
			map.addMapType(G_PHYSICAL_MAP);
			
			var zoom_setting = document.getElementById("wpgeo_map_settings_zoom");
			zoom_setting.value = data.zoom;
			
			// Map Controls
			map.addControl(new GLargeMapControl3D());
			map.addControl(new GMapTypeControl());
			
			// @todo How can we do this without eval()?
			map.setMapType(eval(data.maptype));
			var type_setting = document.getElementById("wpgeo_map_settings_type");
			type_setting.value = wpgeo_getMapTypeContentFromUrlArg(map.getCurrentMapType().getUrlArg());
			
			GEvent.addListener(map, "click", function(overlay, latlng) {
				var latField = document.getElementById("wp_geo_latitude");
				var lngField = document.getElementById("wp_geo_longitude");
				latField.value = latlng.lat();
				lngField.value = latlng.lng();
				marker.setPoint(latlng);
				marker.show();
			});
			
			GEvent.addListener(map, "maptypechanged", function() {
				var type_setting = document.getElementById("wpgeo_map_settings_type");
				type_setting.value = wpgeo_getMapTypeContentFromUrlArg(map.getCurrentMapType().getUrlArg());
			});
			
			GEvent.addListener(map, "zoomend", function(oldLevel, newLevel) {
				var zoom_setting = document.getElementById("wpgeo_map_settings_zoom");
				zoom_setting.value = newLevel;
			});
			
			GEvent.addListener(map, "moveend", function() {
				var center = this.getCenter();
				var centre_setting = document.getElementById("wpgeo_map_settings_centre");
				centre_setting.value = center.lat() + "," + center.lng();
			});
			
			marker = new GMarker(point, {draggable: true});
			
			GEvent.addListener(marker, "dragstart", function() {
				map.closeInfoWindow();
			});
			
			GEvent.addListener(marker, "dragend", function() {
				var coords = marker.getLatLng();
				var latField = document.getElementById("wp_geo_latitude");
				var lngField = document.getElementById("wp_geo_longitude");
				latField.value = coords.lat();
				lngField.value = coords.lng();
			});
					
			//' . apply_filters( 'wpgeo_map_js_preoverlays', '', 'map' ) . '
			map.addOverlay(marker);
			
			var latField = document.getElementById("wp_geo_latitude");
			var lngField = document.getElementById("wp_geo_longitude");
			
			if (data.hide_marker) {
				marker.hide();
			}
			map.checkResize();
		}
		// Avoid memory leaks
		jQuery(window).unload( GUnload );
	});
	
	// Latitude field updated
	jQuery("#wp_geo_latitude").keyup(function() {
		wpgeo_updatedLatLngFields();
	});
	
	
	
	// Longitude field updated
	jQuery("#wp_geo_longitude").keyup(function() {
		wpgeo_updatedLatLngFields();
	});
	
	
	
	// Clear location fields
	jQuery("#wpgeo_location a.wpgeo-clear-location-fields").click(function(e) {
		
		jQuery("input#wp_geo_search").val('');
		jQuery("input#wp_geo_latitude").val('');
		jQuery("input#wp_geo_longitude").val('');
		marker.hide();
		
		return false;
		
	});
	
	
	
	// Centre Location
	jQuery("#wpgeo_location a.wpgeo-centre-location").click(function(e) {
		
		map.setCenter(marker.getLatLng());
		
		return false;
		
	});
	
	
	
	// Location search
	jQuery("#wpgeo_location #wp_geo_search_button").click(function(e) {
		
		var latitude  = jQuery("input#wp_geo_latitude").val();
		var longitude = jQuery("input#wp_geo_longitude").val();
		var address = jQuery("input#wp_geo_search").val();
		
		var geocoder = new GClientGeocoder();
		
		// Set default base country for search
		if ( jQuery("input#wp_geo_base_country_code").length > 0 ) {
			var base_country_code = jQuery("input#wp_geo_base_country_code").val();
			geocoder.setBaseCountryCode(base_country_code);
		}
		
		if ( geocoder ) {
			geocoder.getLatLng(
				address,
				function(point) {
					if ( !point ) {
						alert(address + " not found");
					} else {
						map.setCenter(point);
						marker.setPoint(point);
						marker.show();
						jQuery("input#wp_geo_latitude").val(point.lat());
						jQuery("input#wp_geo_longitude").val(point.lng());
					}
				}
			);
		}
		
		return false;
		
	});
	
	
	
	// Prevent enter from submitting post
	jQuery(window).keydown(function(event){
		if (jQuery("#wpgeo_location input:focus").length > 0) {
			if (event.keyCode == 13) {
				event.preventDefault();
				return false;
			}
		}
	});
	
	
	
});