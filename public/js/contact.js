const contactForm = document.getElementById("contactForm");
const contactLoader = document.getElementById("contactLoader");
const submitButton = document.getElementById("contactSubmitButton");

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Remove old messages
    const oldSuccessMessage = document.querySelector(
        ".contact-success-message"
    );

    const oldErrorMessage = document.querySelector(
        ".contact-error-message"
    );

    if (oldSuccessMessage) {
        oldSuccessMessage.remove();
    }

    if (oldErrorMessage) {
        oldErrorMessage.remove();
    }

    // ======================================
    // CLIENT-SIDE FORM VALIDATION
    // ======================================

    const nameInput = contactForm.querySelector('[name="fullName"]');
    const emailInput = contactForm.querySelector('[name="email"]');
    const messageInput = contactForm.querySelector('[name="message"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Check required fields
    if (!name || !email || !message) {

        const errorMessage =
            document.createElement("div");

        errorMessage.className =
            "contact-error-message";

        errorMessage.innerHTML = `
            <p>
                Please complete all required fields.
            </p>
        `;

        contactForm.before(errorMessage);

        return;
    }


// Check email format
    if (!emailPattern.test(email)) {

        const errorMessage =
            document.createElement("div");

        errorMessage.className =
            "contact-error-message";

        errorMessage.innerHTML = `
            <p>
                Please enter a valid email address.
            </p>
        `;

        contactForm.before(errorMessage);

        emailInput.focus();

        return;
    }


// Check message length
    if (message.length < 10) {

        const errorMessage =
            document.createElement("div");

        errorMessage.className =
            "contact-error-message";

        errorMessage.innerHTML = `
            <p>
                Your message must contain at least 10 characters.
            </p>
        `;

        contactForm.before(errorMessage);

        messageInput.focus();

        return;
    }


    // Show loader
    contactLoader.setAttribute("aria-hidden", "false");
    contactLoader.style.display = "block";

    // Disable submit button
    submitButton.disabled = true;


    // Collect form data
    const formData = new FormData(contactForm);

    const formObject = Object.fromEntries(
        formData.entries()
    );


    try {

        const response = await fetch("/contact", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(formObject)
        });


        const result = await response.json();


        // ======================================
        // SUCCESS
        // ======================================

        if (response.ok && result.success) {

            const successMessage = document.createElement("div");

            successMessage.className =
                "contact-success-message";

            successMessage.innerHTML = `
                <strong>Thank you!</strong>
                <p>${result.message}</p>
            `;

            contactForm.before(successMessage);

            contactForm.reset();
        }


        // ======================================
        // ERROR FROM SERVER
        // ======================================

        else {

            const errorMessage = document.createElement("div");

            errorMessage.className =
                "contact-error-message";

            errorMessage.innerHTML = `
                <p>${result.message}</p>
            `;

            contactForm.before(errorMessage);
        }

    }

    catch (error) {

        console.error(
            "Contact form AJAX error:",
            error
        );

        const errorMessage = document.createElement("div");

        errorMessage.className =
            "contact-error-message";

        errorMessage.innerHTML = `
            <p>
                Something went wrong.
                Please try again.
            </p>
        `;

        contactForm.before(errorMessage);
    }


    // Hide loader
    contactLoader.setAttribute("aria-hidden", "true");
    contactLoader.style.display = "none";

    // Re-enable button
    submitButton.disabled = false;
});