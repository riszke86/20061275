// =========================================================
// AQUARIUM WORLD — DEEP SEA DISCOVERY GAME
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // ================= GAME DATA =================

    const creatures = [
        {
            name: "Giant Pacific Octopus",
            image: "/images/exhibits/giant-pacific-octopus.png",
            options: [
                "Giant Pacific Octopus",
                "Sea Turtle",
                "Clownfish",
                "Freshwater Stingray"
            ]
        },
        {
            name: "Deep-Sea Jellyfish",
            image: "/images/exhibits/deep-sea-jellyfish.png",
            options: [
                "Sea Anemone",
                "Deep-Sea Jellyfish",
                "Starfish",
                "Piranha"
            ]
        },
        {
            name: "Clownfish",
            image: "/images/exhibits/clownfish-cove.png",
            options: [
                "Piranha",
                "Anglerfish",
                "Clownfish",
                "Giant River Fish"
            ]
        },
        {
            name: "Amazonian Stingray",
            image: "/images/exhibits/amazonian-stingrays.png",
            options: [
                "Sea Turtle",
                "Amazonian Stingray",
                "Crab",
                "Octopus"
            ]
        }
    ];


    // ================= ELEMENTS =================

    const creatureImage =
        document.getElementById("creature-image");

    const tileGrid =
        document.getElementById("tile-grid");

    const answerOptions =
        document.getElementById("answer-options");

    const feedback =
        document.getElementById("game-feedback");

    const nextButton =
        document.getElementById("next-creature");

    const scoreDisplay =
        document.getElementById("score");

    const roundDisplay =
        document.getElementById("current-round");


    // ================= GAME STATE =================

    let currentRound = 0;
    let score = 0;
    let answered = false;


    // ================= CREATE ROUND =================

    function loadRound() {

        answered = false;

        const creature = creatures[currentRound];

        creatureImage.src = creature.image;
        creatureImage.alt =
            `Hidden image of ${creature.name}`;

        roundDisplay.textContent =
            currentRound + 1;

        scoreDisplay.textContent =
            score;

        feedback.textContent = "";
        feedback.className = "game-feedback";

        nextButton.hidden = true;

        createTiles();
        createAnswers(creature);
    }


    // ================= CREATE TILES =================

    function createTiles() {

        tileGrid.innerHTML = "";

        for (let i = 0; i < 12; i++) {

            const tile =
                document.createElement("button");

            tile.type = "button";
            tile.className = "reveal-tile";

            tile.setAttribute(
                "aria-label",
                `Reveal image section ${i + 1}`
            );

            tile.addEventListener(
                "click",
                () => {
                    tile.classList.add(
                        "is-revealed"
                    );
                }
            );

            tileGrid.appendChild(tile);
        }
    }


    // ================= CREATE ANSWERS =================

    function createAnswers(creature) {

        answerOptions.innerHTML = "";

        creature.options.forEach(option => {

            const button =
                document.createElement("button");

            button.type = "button";
            button.className = "answer-button";
            button.textContent = option;

            button.addEventListener(
                "click",
                () => checkAnswer(
                    option,
                    creature.name
                )
            );

            answerOptions.appendChild(button);
        });
    }


    // ================= CHECK ANSWER =================

    function checkAnswer(selected, correct) {

        if (answered) {
            return;
        }

        answered = true;

        const buttons =
            answerOptions.querySelectorAll(
                ".answer-button"
            );

        buttons.forEach(button => {
            button.disabled = true;
        });

        if (selected === correct) {

            score++;

            scoreDisplay.textContent =
                score;

            feedback.textContent =
                "Correct! You identified the marine creature.";

            feedback.className =
                "game-feedback correct";

        } else {

            feedback.textContent =
                `Not quite. The correct answer is ${correct}.`;

            feedback.className =
                "game-feedback incorrect";
        }

        // Reveal the complete image
        const tiles =
            tileGrid.querySelectorAll(
                ".reveal-tile"
            );

        tiles.forEach(tile => {
            tile.classList.add(
                "is-revealed"
            );
        });

        nextButton.hidden = false;

        if (
            currentRound ===
            creatures.length - 1
        ) {
            nextButton.textContent =
                "See Final Score";
        } else {
            nextButton.textContent =
                "Next Creature";
        }
    }


    // ================= NEXT ROUND =================

    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentRound <
                creatures.length - 1
            ) {

                currentRound++;
                loadRound();

            } else {

                showFinalScore();
            }
        }
    );


    // ================= FINAL SCORE =================

    function showFinalScore() {

        tileGrid.innerHTML = "";
        answerOptions.innerHTML = "";

        creatureImage.style.display =
            "none";

        roundDisplay.textContent =
            creatures.length;

        feedback.className =
            "game-feedback correct";

        feedback.innerHTML =
            `
                Game complete!<br>
                Your final score is
                ${score} out of
                ${creatures.length}.
            `;

        nextButton.textContent =
            "Play Again";

        nextButton.hidden = false;

        nextButton.onclick = () => {

            currentRound = 0;
            score = 0;

            creatureImage.style.display =
                "block";

            nextButton.onclick = null;

            loadRound();
        };
    }


    // ================= START GAME =================

    loadRound();

});