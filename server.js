const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database
const db = [];

// Pseudo-authentication middleware
app.use((req, res, next) => {
    let sessionToken = req.cookies.session_token;
    if (!sessionToken) {
        sessionToken = 'user_' + Math.random().toString(36).substring(2, 9);
        res.cookie('session_token', sessionToken, { httpOnly: true });
    }
    req.user = { id: sessionToken };
    next();
});

// Secure Create
app.post("/api/treasure", (req, res) => {
    const { name, value } = req.body;
    
    if (!name || typeof value !== 'number') {
        return res.status(400).json({ error: "Invalid name or value" }); // Changed valid name check for brevity
    }

    const treasure = {
        id: Date.now(),
        owner: req.user.id,
        name: name,
        value: value,
        isAdmin: false // explicitly set to false
    };

    db.push(treasure);
    // VULNERABILITY HINT: Frontend will see `isAdmin: false` but UI doesn't show it.
    res.status(201).json(treasure);
});

// List offerings
app.get("/api/treasure", (req, res) => {
    const userTreasures = db.filter(t => t.owner === req.user.id);
    res.json(userTreasures);
});

// Vulnerable Update (Mass Assignment)
app.put("/api/treasure/:id", (req, res) => {
    const treasureId = parseInt(req.params.id);
    const treasure = db.find(t => t.id === treasureId && t.owner === req.user.id);
    
    if (!treasure) {
        return res.status(404).json({ error: "Offering not found or you don't own it." });
    }

    // VULNERABILITY: Mass assignment here
    // Players can inject "isAdmin": true
    Object.assign(treasure, req.body);

    res.json(treasure);
});

// Admin check
app.get("/api/admin/treasury", (req, res) => {
    // Escalate privileges if the user owns ANY treasure offering with isAdmin: true
    const hasAdminOffering = db.some(t => t.owner === req.user.id && t.isAdmin === true);
    
    if (!hasAdminOffering) {
        return res.status(403).json({ error: "Access denied. Only the Pharaoh's highly favored may enter." });
    }

    res.json({
        message: "Welcome, favored one. The Pharaoh's secrets are yours.",
        flag: "NOD{ra_trusts_too_much}"
    });
});

const PORT = process.env.PORT || 31337;
app.listen(PORT, () => {
    console.log(`Ra's Treasury API listening on port ${PORT}`);
});
