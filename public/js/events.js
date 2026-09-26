// ==================== SPECIAL EVENTS AJAX ====================

document.addEventListener("DOMContentLoaded", () => {

    const yearSelect = document.getElementById("event-year");
    const categorySelect = document.getElementById("event-category");
    const eventsGrid = document.getElementById("events-grid");
    const eventsStatus = document.getElementById("events-status");
    const eventModal = document.getElementById("event-details-modal");
    const eventModalBody = document.getElementById("event-modal-body");
    const eventModalClose = document.getElementById("event-modal-close");

    if (!yearSelect || !categorySelect || !eventsGrid) {
        return;
    }

    // Load events whenever a filter changes
    yearSelect.addEventListener("change", loadEvents);
    categorySelect.addEventListener("change", loadEvents);


    async function loadEvents() {

        const year = yearSelect.value;
        const category = categorySelect.value;

        eventsStatus.textContent = "Loading events...";

        try {

            const response = await fetch(
                `/api/events?year=${encodeURIComponent(year)}&category=${encodeURIComponent(category)}`
            );

            if (!response.ok) {
                throw new Error("Events could not be loaded.");
            }

            const events = await response.json();

            displayEvents(events);
            updateStatus(year, events.length);

        } catch (error) {

            console.error("Event loading error:", error);

            eventsGrid.replaceChildren();

            const message = document.createElement("p");
            message.className = "events-empty";
            message.textContent =
                "Events could not be loaded. Please try again.";

            eventsGrid.appendChild(message);

            eventsStatus.textContent = "Unable to load events.";
        }
    }


    function displayEvents(events) {

        eventsGrid.replaceChildren();

        if (events.length === 0) {

            const message = document.createElement("p");
            message.className = "events-empty";
            message.textContent =
                "No events were found for these filters.";

            eventsGrid.appendChild(message);

            return;
        }

        events.forEach(event => {

            const card = document.createElement("article");
            card.className = "event-card";


            // IMAGE

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "event-image-wrapper";

            const image = document.createElement("img");
            image.src = event.image;
            image.alt = event.title;
            image.className = "event-image";

            imageWrapper.appendChild(image);


            // CONTENT

            const content = document.createElement("div");
            content.className = "event-card-content";


            // CATEGORY

            const category = document.createElement("p");
            category.className = "event-category";
            category.textContent = event.category;


            // PAST EVENT INDICATOR

            if (event.is_past === 1) {

                const pastBadge = document.createElement("span");
                pastBadge.className = "past-event-badge";
                pastBadge.textContent = "Past Event";

                content.appendChild(pastBadge);
            }


            // TITLE

            const title = document.createElement("h3");
            title.textContent = event.title;


            // META INFORMATION

            const meta = document.createElement("div");
            meta.className = "event-meta";

            const date = document.createElement("p");
            date.textContent =
                `Date: ${formatDate(event.event_date)}`;

            const time = document.createElement("p");

            if (event.end_time) {
                time.textContent =
                    `Time: ${event.start_time} – ${event.end_time}`;
            } else {
                time.textContent =
                    `Time: ${event.start_time}`;
            }

            const location = document.createElement("p");
            location.textContent =
                `Location: ${event.location}`;

            meta.append(date, time, location);


            // DESCRIPTION

            const description = document.createElement("p");
            description.className = "event-description";
            description.textContent =
                event.short_description;


            // DETAILS BUTTON

            const button = document.createElement("button");
            button.type = "button";
            button.className = "event-details-button";
            button.dataset.eventId = event.id;
            button.textContent = "View Event Details";


            // BUILD CARD

            content.append(
                category,
                title,
                meta,
                description,
                button
            );

            card.append(
                imageWrapper,
                content
            );

            eventsGrid.appendChild(card);
        });
    }


    function updateStatus(year, numberOfEvents) {

        const currentYear =
            new Date().getFullYear().toString();

        if (year < currentYear) {

            eventsStatus.textContent =
                `Showing ${numberOfEvents} past events from ${year}`;

        } else {

            eventsStatus.textContent =
                `Showing ${numberOfEvents} events for ${year}`;
        }
    }


    function formatDate(dateString) {

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

// ==================== EVENT DETAILS ====================

eventsGrid.addEventListener("click", (event) => {

    const detailsButton =
        event.target.closest(".event-details-button");

    if (!detailsButton) {
        return;
    }

    const eventId = detailsButton.dataset.eventId;

    loadEventDetails(eventId);
});


async function loadEventDetails(eventId) {

    eventModalBody.replaceChildren();

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Loading event details...";

    eventModalBody.appendChild(loadingMessage);

    eventModal.showModal();

    try {

        const response = await fetch(
            `/api/events/${encodeURIComponent(eventId)}`
        );

        if (!response.ok) {
            throw new Error(
                "Event details could not be loaded."
            );
        }

        const event = await response.json();

        displayEventDetails(event);

    } catch (error) {

        console.error(
            "Event details error:",
            error
        );

        eventModalBody.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.textContent =
            "Event details could not be loaded. Please try again.";

        eventModalBody.appendChild(errorMessage);
    }
}


function displayEventDetails(event) {

    eventModalBody.replaceChildren();


    const image = document.createElement("img");
    image.src = event.image;
    image.alt = event.title;
    image.className = "event-modal-image";


    const category = document.createElement("p");
    category.className = "event-category";
    category.textContent = event.category;


    const title = document.createElement("h2");
    title.textContent = event.title;


    const date = document.createElement("p");
    date.textContent =
        `Date: ${formatDate(event.event_date)}`;


    const time = document.createElement("p");

    if (event.end_time) {
        time.textContent =
            `Time: ${event.start_time} – ${event.end_time}`;
    } else {
        time.textContent =
            `Time: ${event.start_time}`;
    }


    const location = document.createElement("p");
    location.textContent =
        `Location: ${event.location}`;


    const description = document.createElement("p");
    description.className = "event-modal-description";
    description.textContent =
        event.full_description;


    eventModalBody.appendChild(image);
    eventModalBody.appendChild(category);

    if (event.is_past === 1) {

        const pastBadge = document.createElement("span");
        pastBadge.className = "past-event-badge";
        pastBadge.textContent = "Past Event";

        eventModalBody.appendChild(pastBadge);
    }

    eventModalBody.append(
        title,
        date,
        time,
        location,
        description
    );
}


// Close modal with close button

eventModalClose.addEventListener("click", () => {
    eventModal.close();
});


// Close modal when clicking the backdrop

eventModal.addEventListener("click", (event) => {

    if (event.target === eventModal) {
        eventModal.close();
    }
});

});