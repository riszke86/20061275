// ======================================
// IMPORT MODULES
// ======================================

import express from "express";
import path from "path";
import { fileURLToPath } from "url";


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

app.get("/zones", (req, res) => {
    res.render("zones");
});

app.get("/faq", (req, res) => {
    res.render("faq");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});


// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});