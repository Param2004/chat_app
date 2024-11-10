// client/src/pages/Messages.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Messages = ({ initiateChat }) => {
    const { username } = useParams(); // Get username from route
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the users who have chatted with the current username
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/messages/${username}`);
                const data = await response.json();

                if (data.success) {
                    setUsers(data.users);
                } else {
                    console.error("Failed to load users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [username]);

    const handleUserClick = (otherUser) => {
        // Initiate WebSocket connection for selected user
        initiateChat(username, otherUser);
        
        // Navigate to chat page
        navigate(`/chat/${username}/${otherUser}`);
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Chat List for {username}</h2>
            <div className="w-full max-w-md space-y-3">
                {users.map((user, index) => (
                    <div
                        key={index}
                        onClick={() => handleUserClick(user)}
                        className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-50 transition duration-150 ease-in-out"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">{user}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Messages;
