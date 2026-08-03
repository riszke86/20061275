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


// ======================================================
// CREATE FAQ TABLE
// ======================================================

const createFaqTable = () => {
    connection.run(
        `
        CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            is_active INTEGER NOT NULL DEFAULT 1
                CHECK (is_active IN (0, 1)),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `,
        (error) => {
            if (error) {
                console.error(
                    "Error creating faqs table:",
                    error.message
                );
            } else {
                console.log("faqs table is ready");
            }
        }
    );
};

// ======================================================
// INSERT DEFAULT FAQ RECORDS
// ======================================================

const insertDefaultFaqs = () => {
    const faqRecords = [
        {
            category: "Planning Your Visit",
            question: "What are your opening times?",
            answer:
                "Aquarium World is open every day from 9:00 AM until 6:00 PM. Last admission is at 5:00 PM.",
            displayOrder: 1
        },
        {
            category: "Planning Your Visit",
            question: "How long does a typical visit take?",
            answer:
                "Most visitors spend approximately two to three hours exploring the aquarium, although you are welcome to stay longer.",
            displayOrder: 2
        },
        {
            category: "Planning Your Visit",
            question: "Is Aquarium World suitable for all ages?",
            answer:
                "Yes. Aquarium World has been designed for visitors of all ages, including families with young children, school groups and adults.",
            displayOrder: 3
        },

        {
            category: "Marine Zones",
            question: "What marine zones can I explore?",
            answer:
                "Visitors can explore Coral Kingdom, Deep Sea Trench, Coastal Rockpools and Rainforest Rivers.",
            displayOrder: 4
        },
        {
            category: "Marine Zones",
            question: "Are feeding demonstrations held every day?",
            answer:
                "Yes. Daily talks, feeding demonstrations and marine experiences are listed in the Opening Times section on the Home page.",
            displayOrder: 5
        },
        {
            category: "Marine Zones",
            question: "Can visitors touch any marine animals?",
            answer:
                "Some supervised interactive experiences may allow limited contact with suitable animals. Visitors must always follow staff instructions.",
            displayOrder: 6
        },

        {
            category: "Visiting with Family",
            question: "Can I bring a pushchair?",
            answer:
                "Yes. Pushchairs are welcome throughout the aquarium, although visitors should keep access routes and emergency exits clear.",
            displayOrder: 7
        },
        {
            category: "Visiting with Family",
            question: "Are baby changing facilities available?",
            answer:
                "Yes. Baby changing facilities are available within the visitor toilet areas.",
            displayOrder: 8
        },
        {
            category: "Visiting with Family",
            question: "Is the aquarium suitable for young children?",
            answer:
                "Yes. The aquarium includes colourful exhibits, family-friendly interpretation and interactive experiences suitable for younger visitors.",
            displayOrder: 9
        },

        {
            category: "Accessibility",
            question: "Is Aquarium World wheelchair accessible?",
            answer:
                "Yes. The main visitor areas are designed to be wheelchair accessible, with step-free routes and accessible facilities.",
            displayOrder: 10
        },
        {
            category: "Accessibility",
            question: "Are assistance dogs welcome?",
            answer:
                "Registered assistance dogs are welcome in public visitor areas. Please contact the aquarium before your visit if additional support is required.",
            displayOrder: 11
        },

        {
            category: "Facilities",
            question: "Can I take photographs?",
            answer:
                "Personal photography is welcome. Flash photography may be restricted near sensitive animals, so visitors should follow signs and staff guidance.",
            displayOrder: 12
        },
        {
            category: "Facilities",
            question: "Is parking available?",
            answer:
                "Visitor parking is available near the aquarium. Accessible parking spaces are located close to the main entrance.",
            displayOrder: 13
        },
        {
            category: "Facilities",
            question: "Is there a café?",
            answer:
                "Yes. The aquarium café offers drinks, snacks and light meals during normal opening hours.",
            displayOrder: 14
        },

        {
            category: "Contact",
            question: "How can I contact Aquarium World?",
            answer:
                "You can contact Aquarium World by using the form on the Contact page, by telephone or by email.",
            displayOrder: 15
        },
        {
            category: "Contact",
            question: "Where is Aquarium World located?",
            answer:
                "The aquarium address and contact information are displayed on the Contact page.",
            displayOrder: 16
        }
    ];

    const sql = `
        INSERT INTO faqs (
            category,
            question,
            answer,
            display_order
        )
        SELECT ?, ?, ?, ?
        WHERE NOT EXISTS (
            SELECT 1
            FROM faqs
            WHERE question = ?
        )
    `;

    faqRecords.forEach((faq) => {
        connection.run(
            sql,
            [
                faq.category,
                faq.question,
                faq.answer,
                faq.displayOrder,
                faq.question
            ],
            (error) => {
                if (error) {
                    console.error(
                        "Error inserting FAQ record:",
                        error.message
                    );
                }
            }
        );
    });
};

// ======================================================
// INITIALISE DATABASE
// ======================================================

connection.serialize(() => {
    createContactDetailsTable();
    createContactMessagesTable();
    createFaqTable();

    insertDefaultContactDetails();
    insertDefaultFaqs();
});

export default connection;