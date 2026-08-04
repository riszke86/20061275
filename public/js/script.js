document.addEventListener("DOMContentLoaded", () => {
    const openingHour = 9;
    const closingHour = 18;

    const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    const events = {
        monday: [
            { time: "10:00", title: "Coral Reef Discovery Talk" },
            { time: "11:30", title: "Penguin Feeding" },
            { time: "13:00", title: "Shark Encounter" },
            { time: "14:30", title: "Sea Turtle Rescue Talk" },
            { time: "16:00", title: "Ray Lagoon Experience" }
        ],

        tuesday: [
            { time: "10:00", title: "Tropical Fish Talk" },
            { time: "11:30", title: "Penguin Feeding" },
            { time: "13:00", title: "Deep Sea Discovery" },
            { time: "14:30", title: "Sea Turtle Rescue Talk" },
            { time: "16:00", title: "Shark Encounter" }
        ],

        wednesday: [
            { time: "10:00", title: "Coral Conservation Talk" },
            { time: "11:30", title: "Rockpool Discovery" },
            { time: "13:00", title: "Penguin Feeding" },
            { time: "14:30", title: "Jellyfish Experience" },
            { time: "16:00", title: "Shark Encounter" }
        ],

        thursday: [
            { time: "10:00", title: "Rainforest Rivers Talk" },
            { time: "11:30", title: "Penguin Feeding" },
            { time: "13:00", title: "Crocodile Feeding" },
            { time: "14:30", title: "Sea Turtle Rescue Talk" },
            { time: "16:00", title: "Ray Lagoon Experience" }
        ],

        friday: [
            { time: "10:00", title: "Tropical Fish Talk" },
            { time: "11:30", title: "Penguin Feeding" },
            { time: "13:00", title: "Shark Encounter" },
            { time: "14:30", title: "Ocean Conservation Talk" },
            { time: "16:00", title: "Deep Sea Discovery" }
        ],

        saturday: [
            { time: "10:00", title: "Coral Reef Discovery Talk" },
            { time: "11:30", title: "Penguin Feeding" },
            { time: "13:00", title: "Shark Encounter" },
            { time: "14:30", title: "Sea Turtle Rescue Talk" },
            { time: "16:00", title: "Ray Lagoon Experience" }
        ],

        sunday: [
            { time: "10:00", title: "Family Rockpool Discovery" },
            { time: "11:30", title: "Penguin Feeding" },
            { time: "13:00", title: "Deep Sea Discovery" },
            { time: "14:30", title: "Sea Turtle Rescue Talk" },
            { time: "16:00", title: "Shark Encounter" }
        ]
    };

    const now = new Date();
    const currentDayKey = dayNames[now.getDay()];
    const currentDayName =
        currentDayKey.charAt(0).toUpperCase() + currentDayKey.slice(1);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openingMinutes = openingHour * 60;
    const closingMinutes = closingHour * 60;

    const isOpen =
        currentMinutes >= openingMinutes &&
        currentMinutes < closingMinutes;

    const currentDayElement = document.getElementById("currentDay");
    const statusBadge = document.getElementById("openingStatusBadge");
    const statusText = document.getElementById("openingStatusText");
    const nextEventDetails = document.getElementById("nextEventDetails");

    if (currentDayElement) {
        currentDayElement.textContent = `Today is ${currentDayName}`;
    }

    if (statusBadge && statusText) {
        if (isOpen) {
            statusText.textContent = "Open now";
            statusBadge.classList.remove("is-closed");
        } else {
            statusText.textContent = "Currently closed";
            statusBadge.classList.add("is-closed");
        }
    }

    const todayEvents = events[currentDayKey] || [];

    const nextEvent = todayEvents.find((event) => {
        const [hours, minutes] = event.time.split(":").map(Number);
        const eventMinutes = hours * 60 + minutes;

        return eventMinutes > currentMinutes;
    });

    if (nextEventDetails) {
        if (currentMinutes < openingMinutes) {
            const firstEvent = todayEvents[0];

            nextEventDetails.textContent = firstEvent
                ? `${firstEvent.time} • ${firstEvent.title}`
                : "No scheduled events today";
        } else if (nextEvent) {
            nextEventDetails.textContent =
                `${nextEvent.time} • ${nextEvent.title}`;
        } else {
            nextEventDetails.textContent =
                "Today's scheduled events have finished";
        }
    }

    const scheduleDays = document.querySelectorAll(".schedule-day");

    scheduleDays.forEach((scheduleDay) => {
        const button = scheduleDay.querySelector(".schedule-day-button");
        const dayKey = scheduleDay.dataset.day;

        if (dayKey === currentDayKey) {
            scheduleDay.classList.add("is-today");
        }

        button.addEventListener("click", () => {
            const isActive = scheduleDay.classList.contains("is-active");

            scheduleDays.forEach((day) => {
                day.classList.remove("is-active");

                const dayButton = day.querySelector(
                    ".schedule-day-button"
                );

                dayButton.setAttribute("aria-expanded", "false");
            });

            if (!isActive) {
                scheduleDay.classList.add("is-active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

// ======================================
    // FAQ ACCORDION
    // ======================================

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            faqItems.forEach((faq) => {
                faq.classList.remove("active");

                const faqButton = faq.querySelector(".faq-question");

                if (faqButton) {
                    faqButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            });

            if (!isOpen) {
                item.classList.add("active");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });

});