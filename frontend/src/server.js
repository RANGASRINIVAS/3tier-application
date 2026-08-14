const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:3001";

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>3-Tier Application</title>
            </head>
            <body>
                <h1>3-Tier Application Frontend</h1>
                <p>Frontend is running successfully.</p>
                <p>Backend URL: ${BACKEND_URL}</p>
            </body>
        </html>
    `);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "frontend"
    });
});

app.get("/backend-health", async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/health`);
        const data = await response.json();

        res.status(response.status).json({
            frontend: "healthy",
            backend: data
        });
    } catch (error) {
        res.status(503).json({
            frontend: "healthy",
            backend: "unavailable",
            error: error.message
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/users`);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error fetching users:", error.message);

        res.status(503).json({
            error: "Unable to connect to backend",
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});