// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());
const Item = require('./models/Item');
app.use(express.json()); // Middleware to parse JSON data


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define User and Message schemas
const userSchema = new mongoose.Schema({
    username: String,
    password: String, // For demonstration; consider encryption in production
});

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    content: String,
    timestamp: Date,
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

const http = require('http');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', async (messageData) => {
        const data = JSON.parse(messageData);

        if (data.type === 'register') {
            ws.username = data.username;
            console.log(`User registered: ${data.username}`);
        } else if (data.type === 'message') {
            const { sender, receiver, content } = data;
            const timestamp = new Date();

            // Save message to MongoDB
        const message = new Message({ sender, receiver, content, timestamp });
        await message.save();

            // Send message to recipient if they are connected
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.username === receiver) {
                    client.send(JSON.stringify({ sender, content, timestamp }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

app.get('/messages/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find distinct users who have exchanged messages with the given username
        const users = await Message.aggregate([
            { 
                $match: { $or: [{ sender: username }, { receiver: username }] } 
            },
            { 
                $group: { 
                    _id: null, 
                    participants: { $addToSet: { $cond: { if: { $eq: ["$sender", username] }, then: "$receiver", else: "$sender" } } } 
                }
            }
        ]);

        res.status(200).json({ success: true, users: users[0]?.participants || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching chat users' });
    }
});

app.get('/messages/history/:username/:otherUser', async (req, res) => {
    const { username, otherUser } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: username, receiver: otherUser },
                { sender: otherUser, receiver: username }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching chat history' });
    }
});


// Route to fetch Leased Items
app.get('/api/leased-items/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const leasedItems = await Item.find({
            requested_by: username,
            request_status: 'approved'
        });
        res.status(200).json({ success: true, leasedItems });
    } catch (error) {
        console.error('Error fetching leased items:', error);
        res.status(500).json({ success: false, message: 'Error fetching leased items' });
    }
});

// Route to fetch Lended Items
app.get('/api/lended-items/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const lendedItems = await Item.find({
            lended_by: username,
            return_status: 'pending'
        });
        res.status(200).json({ success: true, lendedItems });
    } catch (error) {
        console.error('Error fetching lended items:', error);
        res.status(500).json({ success: false, message: 'Error fetching lended items' });
    }
});


app.put('/api/items/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { lended_by } = req.body;

    try {
        // Update the item's lended_by field and set request_status to "approved"
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { lended_by, request_status: 'approved' },
            { new: true }
        );

        res.status(200).json({ success: true, item: updatedItem });
    } catch (error) {
        console.error('Error approving item request:', error);
        res.status(500).json({ success: false, message: 'Error approving item request' });
    }
});

app.get('/api/items', async (req, res) => {
    try {
        // Fetch all items from the items collection
        const items = await Item.find({});
        res.status(200).json({ success: true, items });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ success: false, message: 'Error fetching items' });
    }
});

// POST route to handle adding a new item
app.post('/api/items', async (req, res) => {
    const { name, description, requested_by, lended_by, amount, rent_time } = req.body;

    try {
        // Create a new Item instance
        const item = new Item({
            name,
            description,
            requested_by,
            lended_by,
            amount,
            rent_time,
            request_status: 'pending',
            return_status: 'pending'
        });

        // Save the item to MongoDB
        await item.save();

        res.status(201).json({ success: true, message: 'Item added successfully', item });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ success: false, message: 'Error adding item' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
