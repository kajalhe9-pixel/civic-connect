// PASSWORD SHOW / HIDE

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            button.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            button.textContent = "Show";
        }

    });

});


// LOGIN FORM VALIDATION

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        if (!email || !password) {

            message.textContent = "Please fill in all fields.";
            message.className = "form-message error";

            return;
        }

        message.textContent =
            "Frontend validation successful! Backend login will be connected next.";

        message.className = "form-message success";

    });

}


// REGISTRATION FORM VALIDATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();

        const email = document.getElementById("registerEmail").value.trim();

        const mobile = document.getElementById("mobile").value.trim();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const terms = document.getElementById("terms").checked;

        const message = document.getElementById("registerMessage");


        if (name.length < 3) {

            showError("Please enter a valid full name.");
            return;

        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {

            showError("Enter a valid 10-digit Indian mobile number.");
            return;

        }

        if (password.length < 8) {

            showError("Password must contain at least 8 characters.");
            return;

        }

        if (password !== confirmPassword) {

            showError("Passwords do not match.");
            return;

        }

        if (!terms) {

            showError("Please accept the Terms and Conditions.");
            return;

        }


        message.textContent =
            "Frontend validation successful! Backend registration will be connected next.";

        message.className = "form-message success";


        function showError(text) {

            message.textContent = text;
            message.className = "form-message error";

        }

    });

}


// FORGOT PASSWORD PLACEHOLDER

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        alert("Forgot password functionality will be added later.");

    });

}