
let map = L.map("map").setView([28.6139, 77.2090], 13);    

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.marker([28.6139, 77.2090])  
    .addTo(map)
    .bindPopup("Delhi")
    .openPopup();
