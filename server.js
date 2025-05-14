import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("user-joined", (username) => {
    socket.broadcast.emit("chat-message", { username: "System", message: `${username} joined the chat` });
  });

  socket.on("chat-message", (data) => {
    io.emit("chat-message", data);
  });

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("user-left", (username) => {
    socket.broadcast.emit("chat-message", { username: "System", message: `${username} left the chat` });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

