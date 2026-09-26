// ======================================
// IMPORT MODULES
// ======================================

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connection from "./database/database.mjs";


// ======================================
// CREATE EXPRESS APPLICATION
// ======================================

const app = express();
const PORT = 5000;


// ======================================
// CREATE __dirname FOR ES MODULES
// ======================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ======================================
// EJS SETTINGS
// ======================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ======================================
// MIDDLEWARE
// ======================================

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ======================================
// WEBSITE ROUTES
// ======================================

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about", {
        pageTitle: "About Us"
    });
});

app.get("/experiences", (req, res) => {
    res.render("experiences", {
        pageTitle: "Experiences"
    });
});

// ==================== SPECIAL EVENTS ====================

app.get("/events", (req, res) => {

    const eventsSql = `
        SELECT
            events.id,
            events.title,
            events.event_date,
            events.start_time,
            events.end_time,
            events.location,
            events.image,
            events.short_description,
            events.full_description,
            event_categories.id AS category_id,
            event_categories.name AS category,
            CASE
                WHEN date(events.event_date) < date('now')
                THEN 1
                ELSE 0
            END AS is_past
        FROM events
        JOIN event_categories
            ON events.category_id = event_categories.id
        WHERE strftime('%Y', events.event_date) = ?
        ORDER BY events.event_date ASC
    `;

    const categoriesSql = `
        SELECT id, name
        FROM event_categories
        ORDER BY name ASC
    `;

    const yearsSql = `
        SELECT DISTINCT
            strftime('%Y', event_date) AS year
        FROM events
        ORDER BY year DESC
    `;

    const currentYear = new Date().getFullYear().toString();

    connection.all(eventsSql, [currentYear], (eventsError, events) => {

        if (eventsError) {
            console.error("Could not load events:", eventsError.message);

            return res.status(500).send(
                "The events page could not be loaded."
            );
        }

        connection.all(categoriesSql, [], (categoriesError, categories) => {

            if (categoriesError) {
                console.error(
                    "Could not load event categories:",
                    categoriesError.message
                );

                return res.status(500).send(
                    "The events page could not be loaded."
                );
            }

            connection.all(yearsSql, [], (yearsError, years) => {

                if (yearsError) {
                    console.error(
                        "Could not load event years:",
                        yearsError.message
                    );

                    return res.status(500).send(
                        "The events page could not be loaded."
                    );
                }

                res.render("events", {
                    pageTitle: "Special Events",
                    events,
                    categories,
                    years,
                    currentYear
                });
            });
        });
    });
});

// ==================== EVENTS AJAX API ====================

app.get("/api/events", (req, res) => {

    const year = req.query.year;
    const category = req.query.category;

    // Validate the year
    if (!year || !/^\d{4}$/.test(year)) {
        return res.status(400).json({
            error: "Invalid event year."
        });
    }

    let sql = `
        SELECT
            events.id,
            events.title,
            events.event_date,
            events.start_time,
            events.end_time,
            events.location,
            events.image,
            events.short_description,
            event_categories.id AS category_id,
            event_categories.name AS category,
            CASE
                WHEN date(events.event_date) < date('now')
                THEN 1
                ELSE 0
            END AS is_past
        FROM events
        JOIN event_categories
            ON events.category_id = event_categories.id
        WHERE strftime('%Y', events.event_date) = ?
    `;

    const values = [year];

    // Add category filter when one is selected
    if (category && category !== "all") {

        if (!/^\d+$/.test(category)) {
            return res.status(400).json({
                error: "Invalid event category."
            });
        }

        sql += `
            AND events.category_id = ?
        `;

        values.push(category);
    }

    sql += `
        ORDER BY events.event_date ASC
    `;

    connection.all(sql, values, (error, events) => {

        if (error) {
            console.error(
                "Could not filter events:",
                error.message
            );

            return res.status(500).json({
                error: "Events could not be loaded."
            });
        }

        res.json(events);
    });
});

// ==================== EVENT DETAILS AJAX API ====================

app.get("/api/events/:id", (req, res) => {

    const eventId = req.params.id;

    if (!/^\d+$/.test(eventId)) {
        return res.status(400).json({
            error: "Invalid event ID."
        });
    }

    const sql = `
        SELECT
            events.id,
            events.title,
            events.event_date,
            events.start_time,
            events.end_time,
            events.location,
            events.image,
            events.short_description,
            events.full_description,
            event_categories.name AS category,
            CASE
                WHEN date(events.event_date) < date('now')
                THEN 1
                ELSE 0
            END AS is_past
        FROM events
        JOIN event_categories
            ON events.category_id = event_categories.id
        WHERE events.id = ?
    `;

    connection.get(sql, [eventId], (error, event) => {

        if (error) {
            console.error(
                "Could not load event details:",
                error.message
            );

            return res.status(500).json({
                error: "Event details could not be loaded."
            });
        }

        if (!event) {
            return res.status(404).json({
                error: "Event not found."
            });
        }

        res.json(event);
    });
});

// INTERACTIVE ACTIVITY PAGE

app.get("/activity", (req, res) => {
    res.render("activity", {
        pageTitle: "Deep Sea Discovery"
    });
});

app.get("/zones", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            route,
            image,
            introduction,
            tag
        FROM zones
        ORDER BY display_order ASC
    `;

    connection.all(sql, [], (error, zones) => {

        if (error) {
            console.error(
                "Could not load zones:",
                error.message
            );

            return res.status(500).send(
                "The zones page could not be loaded."
            );
        }

        res.render("zones", {
            pageTitle: "Aquarium Zones",
            zones
        });
    });
});

// ======================================
// AJAX SEARCH API
// ======================================

app.get("/api/search", (req, res) => {

    const searchTerm = req.query.q?.trim();

    // Do not search for empty text
    if (!searchTerm) {
        return res.json([]);
    }

    const searchValue = `%${searchTerm}%`;

    const sql = `
        SELECT
            name,
            route,
            'zone' AS type
        FROM zones
        WHERE name LIKE ?
           OR introduction LIKE ?
           OR description LIKE ?

        UNION ALL

        SELECT
            name,
            route,
            'exhibit' AS type
        FROM exhibits
        WHERE name LIKE ?
           OR description LIKE ?

        LIMIT 10
    `;

    connection.all(
        sql,
        [
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        ],
        (error, results) => {

            if (error) {
                console.error(
                    "Search error:",
                    error.message
                );

                return res.status(500).json({
                    error: "Search could not be completed."
                });
            }

            res.json(results);
        }
    );
});

app.get("/zones/:zoneRoute", (req, res) => {

    const zoneRoute = req.params.zoneRoute;

    const zoneSql = `
        SELECT
            id,
            name,
            route,
            image,
            introduction,
            description,
            conservation
        FROM zones
        WHERE route = ?
    `;

    connection.get(zoneSql, [zoneRoute], (error, zone) => {

        if (error) {
            console.error(
                "Could not load zone:",
                error.message
            );

            return res.status(500).send(
                "The zone could not be loaded."
            );
        }

        if (!zone) {
            return res.status(404).send(
                "Zone not found"
            );
        }

        const exhibitsSql = `
            SELECT
                id,
                name,
                route,
                image,
                description
            FROM exhibits
            WHERE zone_id = ?
            ORDER BY display_order ASC
        `;

        connection.all(
            exhibitsSql,
            [zone.id],
            (error, exhibits) => {

                if (error) {
                    console.error(
                        "Could not load exhibits:",
                        error.message
                    );

                    return res.status(500).send(
                        "The exhibits could not be loaded."
                    );
                }

                zone.exhibits = exhibits;

                res.render("zone-details", {
                    zone
                });
            }
        );
    });
});

app.get("/exhibits/:exhibitRoute", (req, res) => {

    const exhibitRoute = req.params.exhibitRoute;

    const sql = `
        SELECT
            exhibits.id,
            exhibits.name,
            exhibits.route,
            exhibits.image,
            exhibits.description,

            zones.id AS zone_id,
            zones.name AS zone_name,
            zones.route AS zone_route,
            zones.image AS zone_image,
            zones.introduction AS zone_introduction,
            zones.description AS zone_description,
            zones.conservation AS zone_conservation

        FROM exhibits

        JOIN zones
            ON exhibits.zone_id = zones.id

        WHERE exhibits.route = ?
    `;

    connection.get(sql, [exhibitRoute], (error, row) => {

        if (error) {
            console.error(
                "Could not load exhibit:",
                error.message
            );

            return res.status(500).send(
                "The exhibit could not be loaded."
            );
        }

        if (!row) {
            return res.status(404).send(
                "Exhibit not found"
            );
        }

        const exhibit = {
            id: row.id,
            name: row.name,
            route: row.route,
            image: row.image,
            description: row.description
        };

        const zone = {
            id: row.zone_id,
            name: row.zone_name,
            route: row.zone_route,
            image: row.zone_image,
            introduction: row.zone_introduction,
            description: row.zone_description,
            conservation: row.zone_conservation
        };

        res.render("exhibit-details", {
            exhibit,
            zone
        });
    });
});

// ======================================
// FAQ PAGE
// ======================================

app.get("/faq", (req, res) => {
    const sql = `
        SELECT
            id,
            category,
            question,
            answer,
            display_order
        FROM faqs
        WHERE is_active = ?
        ORDER BY display_order ASC
    `;

    connection.all(sql, [1], (error, faqs) => {
        if (error) {
            console.error(
                "Could not load FAQ records:",
                error.message
            );

            return res.status(500).send(
                "The FAQ page could not be loaded."
            );
        }

        const groupedFaqs = faqs.reduce((groups, faq) => {
            if (!groups[faq.category]) {
                groups[faq.category] = [];
            }

            groups[faq.category].push(faq);

            return groups;
        }, {});

        res.render("faq", {
            pageTitle: "Frequently Asked Questions",
            groupedFaqs,
            categories: Object.keys(groupedFaqs)
        });
    });
});

app.get("/contact", (req, res) => {
    const sql = `
        SELECT *
        FROM contact_details
        WHERE id = ?
    `;

    connection.get(sql, [1], (error, contactDetails) => {
        if (error) {
            console.error(
                "Could not load contact details:",
                error.message
            );

            return res.status(500).send(
                "The contact page could not be loaded."
            );
        }

        res.render("contact", {
            pageTitle: "Contact Us",
            contactDetails,
            messageSent: req.query.sent === "true",
            formError: null,
            formData: {}
        });
    });
});

app.post("/contact", (req, res) => {
    const {
        fullName,
        email,
        telephone,
        subject,
        message
    } = req.body;

    // ======================================
    // CLEAN FORM DATA
    // ======================================

    const cleanedFullName = fullName?.trim();
    const cleanedEmail = email?.trim();
    const cleanedTelephone = telephone?.trim();
    const cleanedSubject = subject?.trim();
    const cleanedMessage = message?.trim();

    // ======================================
    // SERVER-SIDE VALIDATION
    // ======================================

    if (
        !cleanedFullName ||
        !cleanedEmail ||
        !cleanedSubject ||
        !cleanedMessage
    ) {
      return res.status(400).json({
            success: false,
            message: "Please complete all required fields."
        });
    }

    // ======================================
    // INSERT MESSAGE INTO DATABASE
    // ======================================

    const sql = `
        INSERT INTO contact_messages (
            full_name,
            email,
            telephone,
            subject,
            message
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        cleanedFullName,
        cleanedEmail,
        cleanedTelephone || null,
        cleanedSubject,
        cleanedMessage
    ];


    connection.run(sql, values, function (error) {
        if (error) {
            console.error(
                "Could not save contact message:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "Your message could not be submitted."
            });
        }


        console.log(
            `Contact message saved. Message ID: ${this.lastID}`
        );


        // AJAX SUCCESS RESPONSE

        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully.",
            messageId: this.lastID
        });
    });
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});