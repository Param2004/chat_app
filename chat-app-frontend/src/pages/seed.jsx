// client/src/App.js

import React, { useEffect, useState } from 'react';

const Seed = () => {
    const [username, setUsername] = useState('');
    const [receiver, setReceiver] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectWebSocket = () => {
        if (username && !isConnected) {
            const wsConnection = new WebSocket('wss://chat-n-lease.onrender.com/');
            setWs(wsConnection);

            wsConnection.onopen = () => {
                setIsConnected(true);
                wsConnection.send(JSON.stringify({ type: 'register', username }));
            };

            wsConnection.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setChat((prevChat) => [...prevChat, data]);
            };

            wsConnection.onclose = () => {
                setIsConnected(false);
            };
        }
    };

    const handleSendMessage = () => {
        if (ws && isConnected) {
            ws.send(JSON.stringify({ type: 'message', sender: username, receiver, content: message }));
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Chat FR</h1>

            {/* Username Input and Connect Button */}
            <div className="flex items-center mb-4 w-full max-w-md">
                <input
                    className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    onClick={connectWebSocket}
                    disabled={isConnected}
                    className={`px-4 py-2 font-semibold rounded-r-lg ${
                        isConnected
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isConnected ? 'Connected' : 'Connect'}
                </button>
            </div>

            {/* Receiver Input */}
            <div className="w-full max-w-md mb-4">
                <input
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Receiver's username"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                />
            </div>

            {/* Message Input and Send Button */}
            <div className="flex items-center mb-6 w-full max-w-md">
                <input
                    className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>

            {/* Chat Messages */}
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md space-y-3 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">Chat</h2>
                {chat.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.sender === username ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs ${
                                msg.sender === username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <strong>{msg.sender}:</strong> {msg.content}{' '}
                            <em className="text-xs ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</em>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Seed;
