import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

const app = express();
const PORT = 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "wildheart.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Connected to the WildHeart SQLite database.");
    }
});

// Serve CSS, JavaScript, images, videos and other static files.
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "eco-wildlife-park.html"));
});

// About Us page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "About_Us.html"));
});

// Contact page
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "contact.html"));
});

// Amazon habitat page
app.get("/amazon", (req, res) => {
    res.sendFile(path.join(__dirname, "amazon.html"));
});

// Savannah habitat page
app.get("/savannah", (req, res) => {
    res.sendFile(path.join(__dirname, "savannah.html"));
});

// Reptile habitat page
app.get("/reptile", (req, res) => {
    res.sendFile(path.join(__dirname, "reptile.html"));
});

// Coral Cove habitat page
app.get("/coral", (req, res) => {
    res.sendFile(path.join(__dirname, "coral.html"));
});

// Temporary route to test the SQLite database.
app.get("/database-test", (req, res) => {
    const sql = `
        SELECT habitat_id, name, description, route
        FROM Habitats
        ORDER BY habitat_id
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            console.error("Database query failed:", error.message);
            return res.status(500).send("Database query failed.");
        }

        res.json(rows);
    });
});

// 404 page for unknown routes.
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Page Not Found</title>
        </head>
        <body>
            <h1>404 – Page Not Found</h1>
            <p>The page you requested could not be found.</p>
            <a href="/">Return to the homepage</a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`WildHeart Eco Park is running at http://localhost:${PORT}`);
});