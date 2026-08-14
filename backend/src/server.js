require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.get("/", (req, res) => {
    res.json({
        message: "3-Tier Application Backend is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

app.get("/db-health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            status: "healthy",
            database: "connected",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            status: "unhealthy",
            database: "disconnected"
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, created_at FROM users ORDER BY id"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error.message);

        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});