import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// A single shared connection for the whole app — created once,
// reused by any component that needs real-time updates.
export const socket = io(SOCKET_URL, {
  autoConnect: true,
});
