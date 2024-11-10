import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = ({ ws }) => {
    const { username, otherUser } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`https://chat-n-lease.onrender.com/messages/history/${username}/${otherUser}`);
                const data = await response.json();
                if (data.success) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();

        if (ws) {
            ws.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, messageData]);
            };

            ws.onclose = () => {
                console.log("WebSocket closed in Chat component");
            };
        }
    }, [ws, username, otherUser]);

    const handleSendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const messageData = {
                type: 'message',
                sender: username,
                receiver: otherUser,
                content: newMessage,
                timestamp: new Date().toISOString(),
            };

            ws.send(JSON.stringify(messageData));
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        } else {
            console.error("WebSocket is not open or message is empty");
            alert("Cannot send message. WebSocket is not connected or message is empty.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Chat with {otherUser}</h2>

            <div className="flex-grow overflow-y-scroll p-4 space-y-2 bg-white rounded-md shadow-md">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs ${
                                msg.sender === username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <strong>{msg.sender === username ? "Me" : msg.sender}: </strong> {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow border rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-150"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
