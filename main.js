document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let localStream;
  const remoteStream = new MediaStream();
  let peerConnection;
  let isMuted = false;
  let username = "";
  let room = "";

  // UI elements
  const hangUpButton = document.getElementById("hang-up");
  const muteButton = document.getElementById("mute");
  const messageButton = document.getElementById("message");
  const joinRoomButton = document.getElementById("join-room");
  const usernameInput = document.getElementById("username-input");
  const roomInput = document.getElementById("room-input");
  const usernameDisplay = document.getElementById("username-display");
  const videoContainer = document.getElementById("video-container");
  const controlsContainer = document.getElementById("controls");
  const remoteVideoElement = document.getElementById("remote-video");
  const chatBox = document.getElementById("chat-box");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");
  const messageList = document.getElementById("messageList");

  // Join room button click
  joinRoomButton.addEventListener("click", async () => {
    username = usernameInput.value.trim();
    room = roomInput.value.trim();

    if (!username || !room) {
      alert("Please enter a valid username and room name.");
      return;
    }

    document.getElementById("username-container").style.display = "none";
    videoContainer.style.display = "flex";
    controlsContainer.style.display = "flex";
    usernameDisplay.textContent = `You are: ${username}`;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      document.getElementById("local-video").srcObject = localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Failed to access camera or microphone.");
      return;
    }

    socket.emit("join-room", room, username);
  });

  // Create Peer Connection
  function createPeerConnection(targetId) {
    peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", { targetId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = event => {
      if (event.streams && event.streams[0]) {
        remoteStream.addTrack(event.track);
        remoteVideoElement.srcObject = remoteStream;
      }
    };

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  }

  // Handle room users
  socket.on("room-users", async users => {
    if (users.length > 0) {
      const targetUser = users[0];
      createPeerConnection(targetUser.socketId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", { targetId: targetUser.socketId, offer });
    }
  });

  socket.on("user-joined", ({ username: newUsername }) => {
    console.log(`${newUsername} has joined.`);
  });

  socket.on("offer", async ({ senderId, offer }) => {
    createPeerConnection(senderId);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", { targetId: senderId, answer });
  });

  socket.on("answer", async ({ senderId, answer }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on("ice-candidate", async ({ senderId, candidate }) => {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error("Error adding ICE candidate:", e);
    }
  });

  socket.on("user-left", ({ username: leftUser }) => {
    console.log(`${leftUser} has left.`);
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    remoteVideoElement.srcObject = null;
  });

  // Controls
  function hangUp() {
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    controlsContainer.style.display = "none";
    socket.emit("user-left", room, username);
  }

  function toggleMute() {
    isMuted = !isMuted;
    localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    muteButton.textContent = isMuted ? "Unmute" : "Mute";
  }

  function openMessageWindow() {
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
  }

  // Chat
  sendBtn.onclick = () => {
    const msg = messageInput.value.trim();
    if (msg) {
      socket.emit("chat-message", { message: msg, sender: username, room });
      appendMessage(`You: ${msg}`);
      messageInput.value = "";
    }
  };

  socket.on("chat-message", ({ message, sender }) => {
    appendMessage(`${sender}: ${message}`);
  });

  function appendMessage(msg) {
    const div = document.createElement("div");
    div.textContent = msg;
    messageList.appendChild(div);
    messageList.scrollTop = messageList.scrollHeight;
  }

  // Event Listeners
  hangUpButton.addEventListener("click", hangUp);
  muteButton.addEventListener("click", toggleMute);
  messageButton.addEventListener("click", openMessageWindow);
});
