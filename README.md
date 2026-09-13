# 💬 Discord Clone (Real-Time Chat Application)

A lightweight real-time chat application built with **React**, **Node.js**, **Express**, and **Socket.io**. This application allows users to choose a custom username, join isolated chat rooms (`#general` and `#lounge`), broadcast live messages, and automatically sync chat history upon entering a channel.

---

## ✨ Features

- **Username Gate:** Simple authentication screen allowing users to set a custom chat display name before entering.
- **Dynamic Channel Switching:** Instant navigation between dedicated chat rooms (`#general` and `#lounge`).
- **Room-Isolated Broadcasting:** Messages are broadcast using Socket.io rooms, ensuring users only see messages sent within their active channel.
- **In-Memory Chat History:** The Node.js server persists chat logs per room, automatically serving previous message histories when a client switches rooms.
- **Live Timestamps & Authors:** Real-time payload generation formatting author names, messages, and timestamps (`HH:MM`).

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks, Socket.io-Client)
- **Backend:** Node.js, Express
- **Real-Time Engine:** Socket.io (WebSockets)
- **Middleware:** CORS

---

## 📁 Project Structure

```text
discord-clone-server/
├── server.js               # Express server & Socket.io setup
├── package.json            # Backend dependencies
└── discord-clone-client/   # Nested client folder
    ├── src/
    │   ├── App.js          # React UI & Socket connection
    │   └── index.js
    └── package.json        # Frontend dependencies
```
---
## 🚀 Local Setup & Installation
### 1. Prerequisites
Ensure you have Node.js (v16+) and npm installed.

```bash
git clone https://github.com/skup13/discord-clone-server.git
cd discord-clone-server
```
### 2. Run the Backend Server
Open a terminal tab and execute:

```bash
node server.js
```
The server will start listening on http://localhost:5000.

### 3. Run the Frontend Client
Open a second terminal tab and execute:

```bash
cd discord-clone-client
npm start
```
The React development server will start and open http://localhost:3000 in your default browser.

## 🔑 Technical Architecture & Socket Events
1. join_room: Triggered when a client switches channels. The server removes the client from existing rooms, joins the target socket room, and emits load_history.

2. load_history: Sends the array of stored room messages directly to the joining socket.

3. send_message: Emitted when a client submits a message. The server pushes the payload to the server-side memory (chatHistory) and broadcasts receive_message to all connected clients in that specific room via io.to(room).