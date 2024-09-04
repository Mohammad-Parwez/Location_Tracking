const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const server = http.createServer(app);
const io = socketio(server);
const port = 7004;

// Socket.io connection
io.on("connection", function(socket) {
    console.log("A user connected: " + socket.id);

    // Listen for location data from the client
    socket.on("send-location", function(data){
        // Broadcast the location data to all connected clients
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Render the index.ejs file for the root route
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
