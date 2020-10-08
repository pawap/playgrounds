// Js for managing map interactions
//  @ToDo: encapsulate, Refactor to Typescript

class PlaygroundMap {
	static MODES = Object.freeze({ add: 1, viewOne: 2, browse: 3, edit: 4 });

	constructor() {
		this.map = new ol.Map({
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

		this.playgrounds = [];

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
		this.newSource = new ol.source.Vector({
			features: []
		});

		// Setup & add Overlay for Popup
		this.overlay = new ol.Overlay({
			element: null,
			autoPan: true,
			autoPanAnimation: {
				duration: 250
			}
		});

		this.map.addOverlay(this.overlay);

		// setup and add layer for new playground marker
		var newLayer = new ol.layer.Vector({
			source: this.newSource,
			style: newStyle
		});
		this.map.addLayer(newLayer);

		var self = this;
		// manages click event for brwosing Mode, ie. browsing existing playgrounds
		var browseMarkers = function(event) {
			if (self.map.hasFeatureAtPixel(event.pixel) === true) {
				var coordinate = event.coordinate;
				var feature = self.map.getFeaturesAtPixel(event.pixel)[0];
				var id = feature.getId();
				var playground = self.playgrounds.find(element => element.id == id);
				self.popup.title.innerHTML = playground.name;
				self.popup.text.innerHTML = playground.description;
				self.popup.link.href = '/playground/show/' + id;
				self.overlay.setPosition(coordinate);
			} else {
				self.overlay.setPosition(undefined);
				self.popup.closer.blur();
			}
		};

		// manages click event for adding/edit Mode
		var addMarker = function(event) {
			let newFeature = new ol.Feature({
				geometry: new ol.geom.Point(event.coordinate),
			});
			self.newSource.clear();
			var longLat = ol.proj.toLonLat(event.coordinate);
			document.getElementById('longitude').value = longLat[0];
			document.getElementById('latitude').value = longLat[1];
			self.newSource.addFeature(newFeature);
		};

		// callback for single click
		var singleClick = function(event) {
			switch (self.currentMode) {
				case PlaygroundMap.MODES.edit:
				case PlaygroundMap.MODES.add:
					addMarker(event);
					break;
				case PlaygroundMap.MODES.browse:
					browseMarkers(event);
					break;
				case PlaygroundMap.MODES.viewOne:
			}
		}

		this.map.addEventListener('singleclick', singleClick);

		// default is browsing mode
		this.currentMode = PlaygroundMap.MODES.browse;

	}

	setMode(mode) {
		switch (mode) {
			case PlaygroundMap.MODES.add:
			case PlaygroundMap.MODES.browse:
				//switch to browsingMode
				this.newSource.clear();
				break;
			case PlaygroundMap.MODES.edit:
			case PlaygroundMap.MODES.viewOne:
				// get longLat from hidden inputs
				var lat = document.getElementById('latitude').value;
				var long = document.getElementById('longitude').value;
				var feature = new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat])),
				});
				this.newSource.addFeature(feature)

		}
		this.currentMode = mode;

	};

	getMode() {
		return this.currentMode;
	}

	centerOnMarker() {
		var lat = document.getElementById('latitude').value;
		var long = document.getElementById('longitude').value;
		this.map.getView().setCenter(ol.proj.fromLonLat([long, lat]));
	}

	// initialize Features for Marker Display with playgrounds passed from Controller to view to js. 
	// see index.html. @ToDo: Refactor. Urgh!
	initPlaygrounds(playgrounds) {
		this.playgrounds = playgrounds;
		var features = [];
		playgrounds.forEach(
			playground => {
				let newFeature = new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.fromLonLat([playground.longitude, playground.latitude])),
				});
				newFeature.setId(playground.id)
				features.push(newFeature);
			}
		);
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
		// Setup & add Layer for markers
		var layer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: features
			}),
			style: markerStyle
		});
		this.map.addLayer(layer);

		// get vars for popup elements to be filled with content
		this.popup = {
			closer: document.getElementById('popup-closer'),
			title: document.getElementById('popup-title'),
			text: document.getElementById('popup-text'),
			link: document.getElementById('popup-link')
		}

		var container = document.getElementById('popup');

		// Setup & add Overlay for Popup
		this.overlay.setElement(container);
		
		var self = this;
		// Closing functionality for popup
		this.popup.closer.onclick = function() {
			self.overlay.setPosition(undefined);
			$(this).blur();
			return false;
		};
	}

}

var pm = new PlaygroundMap();
