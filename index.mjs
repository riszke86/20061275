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

const zones = {
    "coral-kingdom": {
        name: "Coral Kingdom",

        introduction:
            "Enter a colourful underwater world filled with coral reefs, tropical fish and fascinating marine animals.",

        description:
            "Coral Kingdom recreates a vibrant tropical reef ecosystem. Visitors can discover how coral reefs support thousands of marine species and learn why these delicate environments require protection.",

        conservation:
            "This zone explains the threats facing coral reefs, including climate change, pollution and habitat damage. Visitors can learn how responsible choices can help protect reef ecosystems.",

        exhibits: [
            {
                name: "Clownfish Cove",
                description:
                    "Discover clownfish living among protective sea anemones and learn about their unique partnership."
            },
            {
                name: "Sea Turtle Sanctuary",
                description:
                    "Meet rescued sea turtles and learn about rehabilitation, conservation and responsible ocean use."
            },
            {
                name: "Living Coral Garden",
                description:
                    "Explore a colourful collection of living corals and discover how coral colonies grow."
            },
            {
                name: "Tropical Reef Tunnel",
                description:
                    "Walk beneath tropical fish, rays and reef species in an immersive underwater tunnel."
            }
        ]
    },

    "deep-sea-trench": {
        name: "Deep Sea Trench",

        introduction:
            "Journey into the darkest parts of the ocean and meet creatures adapted to extreme environments.",

        description:
            "Deep Sea Trench explores the mysterious world far below the ocean surface. Low temperatures, intense pressure and complete darkness create one of Earth's most challenging habitats.",

        conservation:
            "Although deep-sea habitats appear remote, they are affected by pollution, climate change, fishing and seabed activity. This zone highlights why deep-ocean research and protection are important.",

        exhibits: [
            {
                name: "Bioluminescent Creatures",
                description:
                    "Discover animals that produce their own light to communicate, hunt and avoid predators."
            },
            {
                name: "Giant Pacific Octopus",
                description:
                    "Learn about the intelligence, camouflage and remarkable abilities of this large octopus."
            },
            {
                name: "Deep-Sea Jellyfish",
                description:
                    "Observe graceful jellyfish and discover how they survive in dark ocean environments."
            },
            {
                name: "Anglerfish Abyss",
                description:
                    "Explore the unusual adaptations of anglerfish, including their distinctive glowing lure."
            }
        ]
    },

    "coastal-rockpools": {
        name: "Coastal Rockpools",

        introduction:
            "Explore a changing shoreline habitat filled with resilient and fascinating coastal animals.",

        description:
            "Coastal Rockpools introduces visitors to animals that survive between the land and sea. These habitats regularly experience changing water levels, temperatures and wave conditions.",

        conservation:
            "Rockpool ecosystems can be damaged by pollution, litter and irresponsible wildlife handling. Visitors learn how to explore coastlines without disturbing animals or their habitats.",

        exhibits: [
            {
                name: "Starfish Discovery Pool",
                description:
                    "Learn how starfish move, feed and regenerate while exploring their coastal habitat."
            },
            {
                name: "Crab and Lobster Habitat",
                description:
                    "Discover crustaceans that use shells, claws and camouflage to survive."
            },
            {
                name: "Sea Anemone Garden",
                description:
                    "Observe colourful sea anemones and learn how their tentacles capture food."
            },
            {
                name: "Coastal Touch Pool",
                description:
                    "Take part in a supervised interactive experience with selected rockpool species."
            }
        ]
    },

    "rainforest-rivers": {
        name: "Rainforest Rivers",

        introduction:
            "Travel beneath the rainforest canopy and discover extraordinary freshwater wildlife.",

        description:
            "Rainforest Rivers recreates tropical freshwater environments inspired by the Amazon and other major river systems. These habitats support fish, reptiles and many other aquatic species.",

        conservation:
            "Rainforest rivers face threats from deforestation, pollution, mining and habitat loss. This zone demonstrates the connection between healthy forests, clean rivers and wildlife survival.",

        exhibits: [
            {
                name: "Piranha River",
                description:
                    "Discover the behaviour of piranhas and separate scientific facts from common myths."
            },
            {
                name: "Freshwater Turtle Lagoon",
                description:
                    "Meet freshwater turtles and learn about their habitats, diets and conservation needs."
            },
            {
                name: "Amazonian Stingrays",
                description:
                    "Observe freshwater stingrays and discover how they are adapted to life on riverbeds."
            },
            {
                name: "Giant River Fish",
                description:
                    "Encounter some of the largest freshwater fish and learn about rainforest food webs."
            }
        ]
    }
};

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
    res.render("about");
});

app.get("/zones", (req, res) => {
    res.render("zones");
});

app.get("/zones/:zoneRoute", (req, res) => {
    const zoneRoute = req.params.zoneRoute;
    const zone = zones[zoneRoute];

    if (!zone) {
        return res.status(404).send("Zone not found");
    }

    res.render("zone-details", {
        zone: zone
    });
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