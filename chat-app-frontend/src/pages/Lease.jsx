// client/src/pages/Lease.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AddItemForm from './AddItemForm';
import { fetchPendingRequests } from '../utils/api';

const Lease = () => {
    const { username } = useParams();
    const [leasedItems, setLeasedItems] = useState([]);
    const [lendedItems, setLendedItems] = useState([]);
    const [showLeasedItems, setShowLeasedItems] = useState(false);
    const [showLendedItems, setShowLendedItems] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [error, setError] = useState(null);

    const handleSeeRequests = async () => {
        try {
            const usernames = await fetchPendingRequests(username);
            setPendingRequests(usernames);
            setShowRequests(true);
            setError(null);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to fetch pending requests');
        }
    };

      // Fetch Leased Items
      const handleLeasedItems = async () => {
        setShowLeasedItems(true);
        setShowLendedItems(false);
        try {
            const response = await axios.get(`http://localhost:5000/api/leased-items/${username}`);
            setLeasedItems(response.data.leasedItems);
        } catch (error) {
            console.error('Error fetching leased items:', error);
            setError('Failed to fetch leased items');
        }
    };

    // Fetch Lended Items
    const handleLendedItems = async () => {
        setShowLendedItems(true);
        setShowLeasedItems(false);
        try {
            const response = await axios.get(`http://localhost:5000/api/lended-items/${username}`);
            setLendedItems(response.data.lendedItems);
        } catch (error) {
            console.error('Error fetching lended items:', error);
            setError('Failed to fetch lended items');
        }
    };

    return (
        <div className="relative flex flex-col items-center h-screen bg-gray-100 p-4">
        <div>
            <h2 className='mt-4 text-blue-500 font-bold text-xl'>ChatFR</h2>
        </div>
            <button
                className=" absolute right-2 top-2 mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => setShowForm(!showForm)}
            >
                Add +
            </button>

            {showForm && <AddItemForm username={username} onClose={() => setShowForm(false)} />}

            {/* Buttons to Fetch Leased and Lended Items */}
            <div className='mt-40'>
                <button
                    className="w-full h-1/2 px-2 py-6 my-10 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={handleLeasedItems}
                >
                    Leased Items
                </button>
                <button
                    className="w-full h-1/2 px-6 py-6 my10 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={handleLendedItems}
                >
                    Lended Items
                </button>
            </div>

            {/* Display Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Display Leased Items */}
            {showLeasedItems && (
                <div className="w-full max-w-md mt-8 p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Leased Items</h2>
                    {leasedItems.length > 0 ? (
                        <ul>
                            {leasedItems.map((item, index) => (
                                <li key={index} className="p-2 border-b last:border-none">
                                    <strong>{item.name}</strong>: {item.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No leased items found.</p>
                    )}
                </div>
            )}

            {/* Display Lended Items */}
            {showLendedItems && (
                <div className="w-full max-w-md mt-8 p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Lended Items</h2>
                    {lendedItems.length > 0 ? (
                        <ul>
                            {lendedItems.map((item, index) => (
                                <li key={index} className="p-2 border-b last:border-none">
                                    <strong>{item.name}</strong>: {item.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No lended items found.</p>
                    )}
                </div>
            )}

            <button
                className="w-full max-w-xs p-4 mb-6 mt-auto bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={handleSeeRequests}
            >
                See Requests
            </button>

            {/* Display error if location is unavailable */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Display pending requests */}
            {showRequests && (
                <div className="w-full max-w-md mt-8 p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                    {pendingRequests.length > 0 ? (
                        <ul>
                            {pendingRequests.map((user, index) => (
                                <li key={index} className="p-2 border-b last:border-none">
                                    {user}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No pending requests found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Lease;