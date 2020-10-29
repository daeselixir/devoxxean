/* eslint-disable */

export const displayMap = (locations) => {
	mapboxgl.accessToken =
		//"pk.eyJ1IjoiZGFlc2VsaXhpciIsImEiOiJja2d0cW9yM28wMGY1MnRwbG13dXY5eXZuIn0.utV2YyKPZB_wYkVeVwzbxQ";
		"pk.eyJ1IjoiZGFlc2VsaXhpciIsImEiOiJja2d0cW9yM28wMGY1MnRwbG13dXY5eXZuIn0.utV2YyKPZB_wYkVeVwzbxQ";

	var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/daeselixir/ckgtqutk011el19rzs7ciw1a2",
		scrollZoom: true,
	});

	const bounds = new mapboxgl.LngLatBounds();

	locations.forEach((loc) => {
		// Create marker
		let el = document.createElement("div");
		el.className = "marker";

		// Add marker
		new mapboxgl.Marker({
			element: el,
			anchor: "bottom",
		})
			.setLngLat(loc.coordinates)
			.addTo(map);

		// Add popup
		new mapboxgl.Popup({
			offset: 30,
		})
			.setLngLat(loc.coordinates)
			.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
			.addTo(map);

		// Extend map bounds to include current location
		bounds.extend(loc.coordinates);
	});

	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 150,
			left: 100,
			right: 100,
		},
	});
};
