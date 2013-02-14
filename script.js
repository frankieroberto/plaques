
var map, plaque_markers = {};

function stateChanged(event) {

	var request = event.target;
	if (request.readyState === 4) {
	
		if (request.status === 200) {
			var plaques = JSON.parse(request.responseText);
    
    	for (var i=0; i < plaques.length; i++) {
    		var plaque = plaques[i].plaque;

				if (plaque.latitude && plaque.longitude) {
						
					var plaque_icon = new L.DivIcon({
						className: 'plaque-marker',
						html: '',
						iconSize : 16
					});
					
					var plaque_inscription = '<div class="inscription">' + truncate(plaque.inscription, 255) + '</div><div class="info">' +
						'<a class="link" href="http://openplaques.org/plaques/' + plaque.id + '">Plaque ' + plaque.id + '</a> ' +
						'on <a href="http://openplaques.org" class="site">Open Plaques</a>';
					
					var marker = new L.Marker([plaque.latitude, plaque.longitude], {
						icon : plaque_icon,
						opacity: 0.8
					}).bindPopup(plaque_inscription);
					plaque_markers.addLayer(marker)
					
				}
			}
			removeLoading();
			map.addLayer(plaque_markers);
		
		} else {
		console.log(request.status);
		}
	} 
}

function addMap() {

	var map_div = document.getElementById('map');
	var feed_url = map_div.getAttribute('data-feed');

	console.log(feed_url);

	map = L.map('map', {
		minZoom : 2
	}).setView([54, -3], 3);
	

	var attribution = 'Plaque data from <a href="http://openplaques.org">Open Plaques"</a> (PD), map tiles by <a href="http://stamen.com">Stamen Design</a>  <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
	
	var map_tile_layer = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
			attribution: attribution
	});
	
	map_tile_layer.addTo(map);
	
	plaque_markers = new L.MarkerClusterGroup({
		maxClusterRadius : 25,
		showCoverageOnHover : false,
		iconCreateFunction: function(cluster) {
        return new L.DivIcon({ 
        	html: cluster.getChildCount(), 
        	className : 'plaque-cluster-marker ' + clusterSize(cluster.getChildCount()), 
        	iconSize: clusterWidth(cluster.getChildCount())
        });
    }		
		
	});
	
	addLoading();
	var request = new XMLHttpRequest();
  request.onreadystatechange = stateChanged;
  request.open('GET', feed_url, true);
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

function clusterSize(number) {
	
	if (number < 10) {
		return 'small';
	} else if (number < 100) {
		return 'medium';
	} else  {
		return 'large';
	}

}

function clusterWidth(number) {
	
	if (number < 10) {
		return 20;
	} else if (number < 100) {
		return 30;
	} else  {
		return 40;
	}

}

function truncate(string, max_length) {

	if (string.length > max_length) {
		return string.substring(0, max_length) + '...';
	} else {
		return string;
	}

}

document.addEventListener("DOMContentLoaded", addMap, false);
