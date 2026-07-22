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
        image: "/images/zones/coral-kingdom.png",
        introduction: "Enter a colourful underwater world filled with coral reefs, tropical fish and fascinating marine animals.",
        description: "Coral Kingdom recreates a vibrant tropical reef ecosystem. Visitors can discover how coral reefs support thousands of marine species and learn why these delicate environments require protection.",
        conservation: "This zone explains the threats facing coral reefs, including climate change, pollution and habitat damage. Visitors can learn how responsible choices can help protect reef ecosystems.",
        exhibits: [
            {
                name: "Clownfish Cove",
                route: "clownfish-cove",
                image: "/images/exhibits/clownfish-cove.png",
                description: "Discover clownfish living among protective sea anemones and learn about their unique partnership."
            },
            {
                name: "Sea Turtle Sanctuary",
                route: "sea-turtle-sanctuary",
                image: "/images/exhibits/sea-turtle-sanctuary.png",
                description: "Meet rescued sea turtles and learn about rehabilitation, conservation and responsible ocean use."
            },
            {
                name: "Living Coral Garden",
                route: "living-coral-garden",
                image: "/images/exhibits/living-coral-garden.png",
                description: "Explore a colourful collection of living corals and discover how coral colonies grow."
            },
            {
                name: "Tropical Reef Tunnel",
                route: "tropical-reef-tunnel",
                image: "/images/exhibits/tropical-reef-tunnel.png",
                description: "Walk beneath tropical fish, rays and reef species in an immersive underwater tunnel."
            }
        ]
    },

    "deep-sea-trench": {
        name: "Deep Sea Trench",
        image: "/images/zones/deep-sea-trench.png",
        introduction: "Journey into the darkest parts of the ocean and meet creatures adapted to extreme environments.",
        description: "Deep Sea Trench explores the mysterious world far below the ocean surface. Low temperatures, intense pressure and complete darkness create one of Earth's most challenging habitats.",
        conservation: "Although deep-sea habitats appear remote, they are affected by pollution, climate change, fishing and seabed activity. This zone highlights why deep-ocean research and protection are important.",

        exhibits: [
            {
                name: "Bioluminescent Creatures",
                route: "bioluminescent-creatures",
                image: "/images/exhibits/bioluminescent-creatures.png",
                description: "Discover animals that produce their own light to communicate, hunt and avoid predators."
            },
            {
                name: "Giant Pacific Octopus",
                route: "giant-pacific-octopus",
                image: "/images/exhibits/giant-pacific-octopus.png",
                description: "Learn about the intelligence, camouflage and remarkable abilities of this large octopus."
            },
            {
                name: "Deep-Sea Jellyfish",
                route: "deep-sea-jellyfish",
                image: "/images/exhibits/deep-sea-jellyfish.png",
                description: "Observe graceful jellyfish and discover how they survive in dark ocean environments."
            },
            {
                name: "Anglerfish Abyss",
                route: "anglerfish-abyss",
                image: "/images/exhibits/anglerfish-abyss.png",
                description: "Explore the unusual adaptations of anglerfish, including their distinctive glowing lure."
            }
        ]
    },

    "coastal-rockpools": {
        name: "Coastal Rockpools",
        image: "/images/zones/coastal-rockpools.png",
        introduction: "Explore a changing shoreline habitat filled with resilient and fascinating coastal animals.",
        description: "Coastal Rockpools introduces visitors to animals that survive between the land and sea. These habitats regularly experience changing water levels, temperatures and wave conditions.",
        conservation: "Rockpool ecosystems can be damaged by pollution, litter and irresponsible wildlife handling. Visitors learn how to explore coastlines without disturbing animals or their habitats.",

        exhibits: [
            {
                name: "Starfish Discovery Pool",
                route: "starfish-discovery-pool",
                image: "/images/exhibits/starfish-discovery-pool.png",
                description: "Learn how starfish move, feed and regenerate while exploring their coastal habitat."
            },
            {
                name: "Crab and Lobster Habitat",
                route: "crab-lobster-habitat",
                image: "/images/exhibits/crab-lobster-habitat.png",
                description: "Discover crustaceans that use shells, claws and camouflage to survive."
            },
            {
                name: "Sea Anemone Garden",
                route: "sea-anemone-garden",
                image: "/images/exhibits/sea-anemone-garden.png",
                description: "Observe colourful sea anemones and learn how their tentacles capture food."
            },
            {
                name: "Coastal Touch Pool",
                route: "coastal-touch-pool",
                image: "/images/exhibits/coastal-touch-pool.png",
                description: "Take part in a supervised interactive experience with selected rockpool species."
            }
        ]
    },

    "rainforest-rivers": {
        name: "Rainforest Rivers",
        image: "/images/zones/rainforest-rivers.png",
        introduction: "Travel beneath the rainforest canopy and discover extraordinary freshwater wildlife.",
        description: "Rainforest Rivers recreates tropical freshwater environments inspired by the Amazon and other major river systems. These habitats support fish, reptiles and many other aquatic species.",
        conservation: "Rainforest rivers face threats from deforestation, pollution, mining and habitat loss. This zone demonstrates the connection between healthy forests, clean rivers and wildlife survival.",

        exhibits: [
            {
                name: "Piranha River",
                route: "piranha-river",
                image: "/images/exhibits/piranha-river.png",
                description: "Discover the behaviour of piranhas and separate scientific facts from common myths."
            },
            {
                name: "Freshwater Turtle Lagoon",
                route: "freshwater-turtle-lagoon",
                image: "/images/exhibits/freshwater-turtle-lagoon.png",
                description: "Meet freshwater turtles and learn about their habitats, diets and conservation needs."
            },
            {
                name: "Amazonian Stingrays",
                route: "amazonian-stingrays",
                image: "/images/exhibits/amazonian-stingrays.png",
                description: "Observe freshwater stingrays and discover how they are adapted to life on riverbeds."
            },
            {
                name: "Giant River Fish",
                route: "giant-river-fish",
                image: "/images/exhibits/giant-river-fish.png",
                description: "Encounter some of the largest freshwater fish and learn about rainforest food webs."
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

app.get("/exhibits/:exhibitRoute", (req, res) => {

    const exhibitRoute = req.params.exhibitRoute;

    let selectedExhibit = null;
    let selectedZone = null;

    for (const zoneRoute in zones) {

        const zone = zones[zoneRoute];

        const exhibit = zone.exhibits.find(
            currentExhibit =>
                currentExhibit.route === exhibitRoute
        );

        if (exhibit) {

            selectedExhibit = exhibit;

            selectedZone = {
                ...zone,
                route: zoneRoute
            };

            break;
        }
    }

    if (!selectedExhibit || !selectedZone) {
        return res
            .status(404)
            .send("Exhibit not found");
    }

    res.render("exhibit-details", {
        exhibit: selectedExhibit,
        zone: selectedZone
    });
});

app.get("/faq", (req, res) => {
    res.render("faq");
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        pageTitle: "Contact"
    });
});


// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});