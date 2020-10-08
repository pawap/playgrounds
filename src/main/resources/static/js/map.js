// Setup Map
var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		})
	],
	view: new ol.View({
		//center on Hamburg, Germany!
		center: ol.proj.fromLonLat([9.993682, 53.551086]),
		zoom: 10
	})
});

// Setup MarkerStyling for existing playgrounds
var markerStyle = new ol.style.Style({
	image: new ol.style.Circle({
		radius: 7,
		fill: new ol.style.Fill({ color: [20, 20, 100] }),
		stroke: new ol.style.Stroke({
			color: [55, 55, 250], width: 1
		})
	})
})

// Setup MarkerStyling for new playground location
var newStyle = new ol.style.Style({
	image: new ol.style.Circle({
		radius: 7,
		fill: new ol.style.Fill({ color: [200, 20, 100] }),
		stroke: new ol.style.Stroke({
			color: [255, 55, 250], width: 1
		})
	})
})

// initialize source for new playground marker
var newSource = new ol.source.Vector({
	features: []
});

// setup and add layer for new playground marker
var addingLayer = new ol.layer.Vector({
	source: newSource,
	style: newStyle
});
map.addLayer(addingLayer);

// callback for regular Mode, ie. browsing existing playgrounds
var browseMarkers = function(event) {
	if (map.hasFeatureAtPixel(event.pixel) === true) {
		var coordinate = event.coordinate;
		var feature = map.getFeaturesAtPixel(event.pixel)[0];
		var id = feature.getId();
		var playground = playgrounds.find(element => element.id == id);
		title.innerHTML = playground.name;
		text.innerHTML = playground.description;
		link.href = '/playground/show/' + id;
		overlay.setPosition(coordinate);
	} else {
		overlay.setPosition(undefined);
		closer.blur();
	}
};

// callback for adding Mode, ie. adding new playgrounds
var addMarker = function(event) {
	let newFeature = new ol.Feature({
		geometry: new ol.geom.Point(event.coordinate),
	});
	newSource.clear();
	var longLat = ol.proj.toLonLat(event.coordinate);
	document.getElementById('longitude').value = longLat[0];
	document.getElementById('latitude').value = longLat[1];
	newSource.addFeature(newFeature);
};

// default is browsing mode
map.addEventListener('singleclick', browseMarkers);
var addMode = false;

var toggleMode = function() {
	if (addMode) {
		//switch to browsingMode
		addMode = false;
		map.removeEventListener('singleclick', addMarker);
		map.addEventListener('singleclick', browseMarkers);
		newSource.clear();
	} else {
		//switch to addMode
		addMode = true;
		map.removeEventListener('singleclick', browseMarkers);
		map.addEventListener('singleclick', addMarker);
		var lat = document.getElementById('latitude').value;
		var long = document.getElementById('longitude').value;
		if (!lat || !long) return;
		var lastFeature = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat])),
		});
		newSource.addFeature(lastFeature)
	}
};

var centerOnMarker = function() {
	var lat = document.getElementById('latitude').value;
	var long = document.getElementById('longitude').value;
	if (!lat || !long) return;
	map.getView().setCenter(ol.proj.fromLonLat([long, lat]));
}

// initialize Features for Marker Display with playgrounds passed from Controller to view to js. 
// see index.html. @ToDo: Refactor. Urgh!
var features = [];

if (typeof (playgrounds) != "undefined") {
	playgrounds.forEach(
		playground => {
			let newFeature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.fromLonLat([playground.longitude, playground.latitude])),
			});
			newFeature.setId(playground.id)
			features.push(newFeature);
		}
	);

	// Setup & add Layer for markers
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: features
		}),
		style: markerStyle
	});
	map.addLayer(layer);

	// get vars for popup elements to be filled with content
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');
	var title = document.getElementById('popup-title');
	var text = document.getElementById('popup-text');
	var link = document.getElementById('popup-link');

	// Setup & add Overlay for Popup
	var overlay = new ol.Overlay({
		element: container,
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});
	map.addOverlay(overlay);

	// Closing functionality for popup
	closer.onclick = function() {
		overlay.setPosition(undefined);
		$(this).blur();
		return false;
	};

	// add functionality to Add-Button, ie. switch between browsingMode & addMode
	var add = document.getElementById('add-playground');

	add.onclick = function() {
		add.innerHTML = addMode ? 'Abort' : 'Add';
		toggleMode();
	};
}





