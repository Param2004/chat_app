// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Messages from './pages/Messages';
import Seed from './pages/Seed';
import Chat from './pages/Chat';
import Lease from './pages/Lease';

const App = () => {
  const [ws, setWs] = useState(null);

  const initiateChat = (username, otherUser) => {
    // Close any existing WebSocket connection
    if (ws) ws.close();

    // Open a new WebSocket connection
    const newWs = new WebSocket(`ws://localhost:5000`);
    setWs(newWs);

    newWs.onopen = () => {
      console.log("WebSocket opened for:", username, "and", otherUser);
      newWs.send(JSON.stringify({ type: 'register', username, otherUser }));
    };

    newWs.onclose = () => {
      console.log("WebSocket closed");
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Seed />} />
        <Route path="/messages/:username" element={<Messages initiateChat={initiateChat} />} />
        <Route path="/lease/:username" element={<Lease />} />
        <Route path="/chat/:username/:otherUser" element={<Chat ws={ws} />} />
      </Routes>
    </Router>
  );
};

export default App;