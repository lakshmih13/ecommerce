const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

// socket.io needs the raw HTTP server (not the Express app directly)
// so it can upgrade connections to WebSockets alongside normal HTTP traffic.
const server = http.createServer(app);

initSocket(server, process.env.CLIENT_ORIGIN);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
