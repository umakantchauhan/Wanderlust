const map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
console.log([coordinates[1], coordinates[0]]);

const redIcon = new L.Icon({
  iconUrl: '/images/pin.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -40],
  shadowSize: [41, 41]
});

const marker = L.marker([coordinates[1], coordinates[0]], { icon: redIcon }).addTo(map);

marker.bindPopup(`<b>Hello! <br>welcome to Wanderlust</b><br>This is ${listingLocation}.`).openPopup();