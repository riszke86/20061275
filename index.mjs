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