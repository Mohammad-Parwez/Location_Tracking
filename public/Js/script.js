const socket = io();
console.log("Socket connected");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Sending location: ${latitude}, ${longitude}`);
        socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
        console.error("Error getting location: ", error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 2);  // l.map will ask permission for knowing your location
//  Start with a global view
//l.tileLayer will show you world map.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Day1 Pz"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log(`Received location for ${id}: ${latitude}, ${longitude}`);

    // Center the map on the received location
    map.setView([latitude, longitude], 16);

    // Update or create the marker for this id
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        console.log(`Updated marker for ${id}`);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        console.log(`Created new marker for ${id}`);
    }
});
