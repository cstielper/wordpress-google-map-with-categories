// VARIABLES
// ID of HTML element to hold the map
var myMap = 'map-canvas';

// Google Maps API Key
var apiKey = 'ADD_YOUR_GOOGLE_MAPS_API_KEY';

// Paths to JSON data
var markersFeed = '/THE_PATH_YOU_WANT_TO_USE/wp-json/wp/v2/area_landmarks/?filter[posts_per_page]=-1';

// Specify whether you want to add category controls for landmarks to the map (true/false).
// If you do, add the path to your category feed and the path to your image directory where your icons are stored
var addCats = true;
var catsFeed = '/THE_PATH_YOU_WANT_TO_USE/wp-json/wp/v2/landmark_types';
var catIconPath = '/THE_PATH_TO_THE_DIRECTORY_WHERE_YOUR_MAP_ICONS_ARE_STORED';

var map;
var bounds;
var infowindow;
var currentInfoWindow = null;
var landmarksObj;
var catsObj;
var markers = [];
var locations = [];
var resetBtn = document.getElementById('reset-map');

// Check to see if there is an HTML element on our page to load the map into (#map-canvas).
// If there is, call the Google Maps API with our API key and a callback function
document.addEventListener('DOMContentLoaded', function () {
	if (document.getElementById(myMap)) {
		var lang;
		if (document.querySelector('html').lang) {
			lang = document.querySelector('html').lang;
		} else {
			lang = 'en';
		}

		var map_js_file = document.createElement('script');
		map_js_file.type = 'text/javascript';
		map_js_file.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=callback&language=' + lang;
		document.getElementsByTagName('body')[0].appendChild(map_js_file);
	}
});

// Build the map, push to the markers array for using "bounds," push to the locations array for use with category navigation
function buildMap(data) {
	bounds = new google.maps.LatLngBounds();

	var mapStyles =[{
		featureType: "poi",
		elementType: "labels",
		stylers: [{
			visibility: "off" }
		]}
	];

	map = new google.maps.Map(document.getElementById('map-canvas'), {
		mapTypeControl: false,
		scrollwheel: false,
		panControl: false,
		rotateControl: false,
		streetViewControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		styles: mapStyles,
	});

	for(var i = 0; i < data.length; i++) {
		var title = data[i].title.rendered;
		var add = data[i].acf.address;
		var add2 = data[i].acf.address_2;
		var phone = data[i].acf.phone;
		var website = data[i].acf.website;
		var details = data[i].acf.additional_details;
		var latitude = data[i].acf.latitude;
		var longitude = data[i].acf.longitude;
		var category = 'cat-' + data[i].landmark_types[0];
		
		if(title !== '') {
			title = '<strong class="window-heading">' + title + '</strong>';
		} else {
			title = '';
		}
		
		if(add !== '') {
			add = '<br>' + add;
		} else {
			add = '';
		}
		
		if(add2 !== '') {
			add2 = '<br>' + add2;
		} else {
			add2 = '';
		}
		
		if(phone !== '') {
			phone = '<br>' + phone;
		} else {
			phone = '';
		}
		
		if(website !== '') {
			website = '<br><a target="_blank" href="' + website + '">Website &raquo;</a>';
		} else {
			website = '';
		}

		if(details !== '') {
			details = '<br><br>' + details;
		} else {
			details = '';
		}

		locations.push([i, title, latitude, longitude, add, add2, phone, website, details, category]);
	}

	function openInfoWindow(marker) {
		marker.addListener('click', function() {
			infowindow = new google.maps.InfoWindow();
			if (currentInfoWindow !== null) {
			 	currentInfoWindow.close();
			}
			currentInfoWindow = infowindow; 
			infowindow.setContent(marker.html);
			infowindow.open(map, marker);
		});
	}

	for(var j = 0; j < locations.length; j++) {
		var image = catIconPath + locations[j][9] + '.png';
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[j][2], locations[j][3]),
			map: map,
			icon: image,
			html: '<strong class="heading">' + locations[j][1] + '</strong>' + locations[j][4] + locations[j][5] + locations[j][6] + locations[j][7] + locations[j][8],
		});
		markers.push(marker);
		bounds.extend(marker.getPosition());

		openInfoWindow(marker);
	}

	map.fitBounds(bounds);
}

// Build the category navigation
var catNav = document.createElement('nav');
catNav.id = 'map-nav';

function buildCats(data, map) {
	var mapWrapper = document.getElementById(map).parentNode;
	mapWrapper.appendChild(catNav, document.getElementById(map));
	var catNavUl = document.createElement('ul');
	catNav.appendChild(catNavUl);
	
	// View/hide markers on the map and swap active class on category nav
	function catClick(href, ul) {
		href.addEventListener('click', function(event) {
			event.preventDefault();
			if(infowindow) {
				infowindow.close();
			}
			var cat = (this.parentElement.getAttribute('id'));
			
			for(var i = 0; i < locations.length; i++) {
				if (locations[i][9] === cat) {
					markers[i].setVisible(true);
					markers[i].setOptions({zIndex:1100});
				} else if (locations[i][9] !== cat) {
					markers[i].setVisible(false);
				}
			}

			var children = [];
			children = ul.children;
			for(var j = 0; j < children.length; j++) {
				children[j].firstChild.classList.remove('active');
			}

			this.classList.add('active');
			resetBtn.classList.add('active');
		});
	}

	for(var i = 0; i < data.length; i++) {
		var listItem = document.createElement('li');
		listItem.id = 'cat-' + data[i].id;
		listItem.classList.add(data[i].slug);
		var listItemHref = document.createElement('a');
		listItemHref.href = '#';
		listItemHref.innerText = data[i].name;
		listItem.appendChild(listItemHref);
		catNavUl.appendChild(listItem);

		catClick(listItemHref, catNavUl);
	}
}

// Grab our JSON data of landmarks and if successful, call the function to build our map
function initMap(feed) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4 && xhr.status === 200) {
			landmarksObj = JSON.parse(xhr.responseText);
			document.getElementById('map-canvas').innerHTML = '';
			buildMap(landmarksObj);
		} else {
			document.getElementById('map-canvas').innerHTML = 'Error Loading Data';
		}
	};

	xhr.overrideMimeType('application/json');
	xhr.open('GET', feed, true);
	xhr.send();
	document.getElementById('map-canvas').innerHTML = 'Loading map...';
}

// Grab our JSON data of categories and if successful, call the function to build our category nav
function initCats(feed) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4 && xhr.status === 200) {
			catsObj = JSON.parse(xhr.responseText);
			buildCats(catsObj, myMap);
		}
	};

	xhr.overrideMimeType('application/json');
	xhr.open('GET', feed, true);
	xhr.send();
}

// Callback function called after Google Maps API loads that makes calls to fetch our landmark and category data
function callback() {
	initMap(markersFeed);
	if(addCats === true) {
		initCats(catsFeed);
	}
}

// Reset Controls
function resetMap(map, btn) {
	for(var i = 0; i < locations.length; i++) {
		markers[i].setVisible(true);
	}
	
	map.fitBounds(bounds);
	
	if(infowindow) {
		infowindow.close();
	}

	var mapNavItems = catNav.children[0].childNodes;
	for(var j = 0; j < mapNavItems.length; j++) {
		mapNavItems[j].firstChild.classList.remove('active');
	}

	btn.classList.remove('active');
}

resetBtn.addEventListener('click', function() {
	resetMap(map, this);
});
