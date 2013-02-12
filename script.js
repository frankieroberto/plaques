
var map, plaque_markers = {};

function stateChanged(event) {

	var request = event.target;
	if (request.readyState === 4) {
	
		if (request.status === 200) {
			var plaques = JSON.parse(request.responseText);
    
    	for (var i=0; i < plaques.length; i++) {
    		var plaque = plaques[i].plaque;

				if (plaque.latitude && plaque.longitude) {
						
					var plaque_icon = new L.Icon({
						iconUrl : "./images/marker-icon.png",
						iconRetinaUrl: "./images/marker-icon@2x.png",
						iconSize : 19
					});
					var marker = new L.Marker([plaque.latitude, plaque.longitude], {
						icon : plaque_icon,
						opacity: 0.8
					});
					plaque_markers.addLayer(marker);
				}
			}
			removeLoading();
			map.addLayer(plaque_markers);
		
		} 
	} 
}

function addMap() {

	map = L.map('map').setView([54, -3], 6);
	

	var PlaqueIcon = L.Icon.extend({
			iconUrl: 'marker.png',
			shadowUrl: './marker-shadow.png',
	});

	var attribution = 'Plaque data from <a href="http://openplaques.org">Open Plaques"</a> (PD), map tiles by <a href="http://stamen.com">Stamen Design</a>  <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
	
	var map_tile_layer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
			attribution: attribution
	});
	
	map_tile_layer.addTo(map);
	
	plaque_markers = new L.MarkerClusterGroup({
		maxClusterRadius : 30,
		showCoverageOnHover : false
	});
	
	addLoading();
	var request = new XMLHttpRequest();
  request.onreadystatechange = stateChanged;
  request.open('GET', 'http://openplaques.org/plaques.json?limit=500&data=simple', true);
	request.send(null);


}

function removeLoading() {
	var loading_div = document.getElementById('loading');
	document.body.removeChild(loading_div);
}

function addLoading() {
	var loading_div = document.createElement("div");
	loading_div.setAttribute("id", "loading");
	loading_div.innerHTML = "Loading";
	document.body.appendChild(loading_div);
}

document.addEventListener("DOMContentLoaded", addMap, false);
