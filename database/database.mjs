import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, "AquariumWorld.db");

const connection = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Database connected successfully");
    }
});

const createContactDetailsTable = () => {
    connection.run(
        `
        CREATE TABLE IF NOT EXISTS contact_details (
            id INTEGER PRIMARY KEY,
            aquarium_name TEXT NOT NULL,
            email TEXT NOT NULL,
            telephone TEXT NOT NULL,
            address_line_one TEXT NOT NULL,
            address_line_two TEXT,
            city TEXT NOT NULL,
            postcode TEXT NOT NULL,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `,
        (error) => {
            if (error) {
                console.error(
                    "Error creating contact_details table:",
                    error.message
                );
            } else {
                console.log("contact_details table is ready");
            }
        }
    );
};

const createContactMessagesTable = () => {
    connection.run(
        `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            telephone TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `,
        (error) => {
            if (error) {
                console.error(
                    "Error creating contact_messages table:",
                    error.message
                );
            } else {
                console.log("contact_messages table is ready");
            }
        }
    );
};

const insertDefaultContactDetails = () => {
    connection.run(
        `
        INSERT OR IGNORE INTO contact_details (
            id,
            aquarium_name,
            email,
            telephone,
            address_line_one,
            address_line_two,
            city,
            postcode
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            1,
            "Aquarium World",
            "info@aquariumworld.co.uk",
            "01908 000 000",
            "Ocean Discovery Centre",
            "Marine Way",
            "Milton Keynes",
            "MK1 1AA"
        ],
        (error) => {
            if (error) {
                console.error(
                    "Error inserting contact details:",
                    error.message
                );
            } else {
                console.log("Default contact details are ready");
            }
        }
    );
};

connection.serialize(() => {
    createContactDetailsTable();
    createContactMessagesTable();
    insertDefaultContactDetails();
});

export default connection;