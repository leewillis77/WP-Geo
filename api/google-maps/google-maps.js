
var WPGeo_API_GoogleMaps = {

	// Vars
	var_1: true,
	var_2: false,
	
	// Init
	init : function() {
	},
	
	// Create Marker
	createMarker : function(options) {
		var tooltip;
		var link;
		
		// Create the marker
		var marker = new GMarker(options.latlng, options.icon);
		
		// Create a custom tooltip
		if (options.title) {
			tooltip = new Tooltip(marker, options.title)
		}
		
		marker.latlng = options.latlng;
		marker.tooltip = tooltip;
		marker.title = options.title;
		marker.link = options.link;
		
		if (tooltip) {
			GEvent.addListener(marker, "mouseover", function() {
				if ( ! (this.isInfoWindowOpen) && ! (this.isHidden()) ) {
					this.tooltip.show();
				}
			});
			GEvent.addListener(marker, "mouseout", function() {
				this.tooltip.hide();
			});
		}
		
		if (options.link) {
			GEvent.addListener(marker, "click", function() {
				window.location.href= this.link;
			});
		}
		
		options.map.addOverlay(marker);
		
		if (!options.map) {
			bounds.extend(marker.getPoint());
		}
		
		return marker;
	},
	
	// Create the polygonal lines between markers
	createPolyline : function(coords, color, thickness, alpha) {
		var polyOptions = { clickable:true, geodesic:true };
		var polyline = new GPolyline(coords, color, thickness, alpha, polyOptions);
		return polyline;
	},
	
	// Create a custom marker icon for the map
	createIcon : function(width, height, anchorX, anchorY, image, transparent) {
		var icon = new GIcon();
		icon.image = image;
		icon.iconSize = new GSize(width, height);
		icon.iconAnchor = new GPoint(anchorX, anchorY);
		icon.shadow = transparent;
		return icon;
	}

}

/**
 * Create a marker for the map
 * @todo: Deprecate legacy marker functions
 */
function wpgeo_createMarker(latlng, icon, title, link) {
	var marker = WPGeo_API_GoogleMaps.createMarker({
		latlng : latlng,
		icon   : icon,
		title  : title,
		link   : link
	});
	return marker;
}

/**
 * Create a marker for the map (2)
 * @todo: Deprecate legacy marker functions
 */
function wpgeo_createMarker2(map, latlng, icon, title, link)  {
	var marker = WPGeo_API_GoogleMaps.createMarker({
		map    : map,
		latlng : latlng,
		icon   : icon,
		title  : title,
		link   : link
	});
	return marker;
}
