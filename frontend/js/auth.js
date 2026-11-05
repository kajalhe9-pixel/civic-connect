// SHOW AND HIDE PASSWORD

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const targetId = button.getAttribute("data-target");

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


// REGISTRATION PASSWORD VALIDATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match!");
            return;

        }

        alert("Registration form is ready for backend integration!");

    });

}


// LOGIN FORM

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Login form is ready for backend integration!");

    });

}