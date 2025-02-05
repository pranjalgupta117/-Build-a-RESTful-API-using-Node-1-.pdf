// Import necessary modules
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`Status Code: ${res.statusCode}`);
    });
    next();
});

// In-memory data source
let users = [];

// Validation middleware
function validateUser(req, res, next) {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: 'Missing required fields: firstName, lastName, hobby' });
    }
    next();
}

// GET /users - Fetch all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// GET /users/:id - Fetch user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
});

// POST /user - Add new user
app.post('/user', validateUser, (req, res) => {
    const { firstName, lastName, hobby } = req.body;
    const newUser = {
        id: (users.length + 1).toString(),
        firstName,
        lastName,
        hobby
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /user/:id - Update user details
app.put('/user/:id', validateUser, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { firstName, lastName, hobby } = req.body;
    users[userIndex] = { id: req.params.id, firstName, lastName, hobby };
    res.status(200).json(users[userIndex]);
});

// DELETE /user/:id - Delete user by ID
app.delete('/user/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    const deletedUser = users.splice(userIndex, 1);
    res.status(200).json(deletedUser[0]);
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
