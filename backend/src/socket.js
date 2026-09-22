const { Server } = require("socket.io");

let io = null;

// Called once from server.js with the raw HTTP server.
function initSocket(httpServer, corsOrigin) {
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Controllers call this after a product changes so every connected
// browser tab (admin and viewers alike) updates without refreshing.
function emitProductEvent(event, payload) {
  if (!io) return; // socket.io not initialized (e.g. during tests)
  io.emit(event, payload);
}

module.exports = { initSocket, emitProductEvent };
