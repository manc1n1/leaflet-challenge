let map = L.map('map').setView([37.0902, -95.7129], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function calculateRadius(magnitude) {
	return Math.pow(2, magnitude) * 2;
}

function calculateColor(depth) {
	if (depth >= -10 && depth <= 10) {
		return 'hsl(183, 74%, 35%)';
	} else if (depth > 10 && depth <= 30) {
		return 'hsl(109, 58%, 40%)';
	} else if (depth > 30 && depth <= 50) {
		return 'hsl(35, 77%, 49%)';
	} else if (depth > 50 && depth <= 70) {
		return 'hsl(22, 99%, 52%)';
	} else if (depth > 70 && depth <= 90) {
		return 'hsl(355, 76%, 59%)';
	} else {
		return 'hsl(347, 87%, 44%)';
	}
}

d3.json(
	'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
)
	.then((data) => {
		data.features.forEach(function (feature) {
			let magnitude = feature.properties.mag;
			let depth = feature.geometry.coordinates[2];
			let coordinates = feature.geometry.coordinates;
			let latlng = L.latLng(coordinates[1], coordinates[0]);
			let radius = calculateRadius(magnitude);
			let color = calculateColor(depth);
			let popupContent =
				'<b>Location:</b> ' +
				feature.properties.place +
				'<br>' +
				'<b>Magnitude:</b> ' +
				magnitude +
				'<br>' +
				'<b>Depth:</b> ' +
				depth +
				' km';
			let marker = L.circleMarker(latlng, {
				radius: radius,
				color: color,
				fillOpacity: 0.75,
			})
				.addTo(map)
				.bindPopup(popupContent);
		});
		let legend = L.control({ position: 'bottomright' });
		legend.onAdd = function () {
			let div = L.DomUtil.create('div', 'legend');
			let labels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
			let legendContent =
				'<div class="legend-title"><strong>Earthquake Depth (km)</strong></div>';
			labels.forEach(function (label, index) {
				let color = calculateColor(index * 20);
				legendContent +=
					'<div class="legend-item"><span style="background-color:' +
					color +
					'"></span>' +
					label +
					'</div>';
			});
			div.innerHTML = legendContent;
			return div;
		};
		legend.addTo(map);
	})
	.catch(function (error) {
		console.error('Error loading earthquake data:', error);
	});
