document.addEventListener("DOMContentLoaded", () => {
    const contactForm =
        document.getElementById("contactForm");

    const submitButton =
        document.getElementById("contactSubmitButton");

    const contactLoader =
        document.getElementById("contactLoader");

    const buttonText =
        submitButton?.querySelector(".contact-button-text");

    if (
        !contactForm ||
        !submitButton ||
        !contactLoader ||
        !buttonText
    ) {
        return;
    }

    let isSubmitting = false;

    contactForm.addEventListener("submit", (event) => {
        if (isSubmitting) {
            event.preventDefault();
            return;
        }

        if (!contactForm.checkValidity()) {
            return;
        }

        event.preventDefault();

        isSubmitting = true;

        submitButton.disabled = true;
        buttonText.textContent = "Sending...";

        contactLoader.classList.add("is-visible");
        contactLoader.setAttribute("aria-hidden", "false");

        window.setTimeout(() => {
            contactForm.submit();
        }, 900);
    });
});