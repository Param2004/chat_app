// client/src/pages/AddItemForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddItemForm = ({ username, onClose }) => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post('https://chat-n-lease.onrender.com/api/items', {
                name: itemName,
                description: itemDescription,
                requested_by: username,
                request_status: 'pending',
                lended_by: '', // Set this as needed
                return_status: 'pending',
                timestamp_request: new Date(),
                amount: 0, // Set a default amount or handle it in the form if needed
                rent_time: 1 // Set a default rent time or handle it in the form if needed
            });

            setItemName('');
            setItemDescription('');
            onClose();
        } catch (error) {
            console.error('Error adding item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            
            <label className="block mb-2 text-sm font-medium text-gray-700">Item Name</label>
            <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
                className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
            />

            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Add Item'}
            </button>
        </form>
    );
};

export default AddItemForm;
