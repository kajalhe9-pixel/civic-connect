
// GET ELEMENTS

const complaintForm = document.getElementById("complaintForm");
const photoInput = document.getElementById("photos");
const imagePreview = document.getElementById("imagePreview");
const locationBtn = document.getElementById("locationBtn");
const locationStatus = document.getElementById("locationStatus");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const successMessage = document.getElementById("successMessage");
const successDetails = document.getElementById("successDetails");

const API_URL = `${window.CIVIC_API_BASE_URL}/complaints`;


// SINGLE PHOTO UPLOAD AND PREVIEW

photoInput.addEventListener("change", function () {

    imagePreview.innerHTML = "";

    const file = photoInput.files[0];

    if (!file) {
        return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Only JPG and PNG images are allowed.");
        photoInput.value = "";
        return;
    }

    // Check file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5 MB.");
        photoInput.value = "";
        return;
    }

    // Show image preview
    const reader = new FileReader();

    reader.onload = function (event) {

        const image = document.createElement("img");

        image.src = event.target.result;
        image.alt = "Complaint photograph";

        imagePreview.appendChild(image);

    };

    reader.readAsDataURL(file);

});


// GET CURRENT GPS LOCATION

locationBtn.addEventListener("click", function() {

    if (!navigator.geolocation) {
        locationStatus.textContent =
            "GPS is not supported by your browser.";
        return;
    }

    locationBtn.disabled = true;
    locationBtn.textContent = "Getting Location...";

    locationStatus.textContent =
        "Please allow location permission.";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            latitudeInput.value = latitude;
            longitudeInput.value = longitude;

            locationStatus.textContent =
                "✓ Location captured successfully!";

            locationStatus.style.color = "#168354";

            locationBtn.textContent = "Location Captured ✓";
            locationBtn.disabled = false;

        },

        function(error) {

            let message = "Unable to get your location.";

            if (error.code === error.PERMISSION_DENIED) {
                message = "Location permission denied. Please allow it in your browser.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                message = "Your location is currently unavailable.";
            } else if (error.code === error.TIMEOUT) {
                message = "Location request timed out. Please try again.";
            }

            locationStatus.textContent = message;
            locationBtn.textContent = "Try Again";
            locationBtn.disabled = false;

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

});


// SUBMIT COMPLAINT TO BACKEND

complaintForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Check login token
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login before submitting a complaint.");
        window.location.href = "login.html";
        return;
    }

    // Get form values
    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const address = document.getElementById("address").value.trim();

    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;

    // Validate required fields
    if (!category || !title || !description || !address) {
        alert("Please fill in all required fields.");
        return;
    }

    if (description.length < 10) {
        alert("Please provide a more detailed description.");
        return;
    }

    if (latitude === "" || longitude === "") {
        alert("Please capture your GPS location before submitting.");
        return;
    }

    // Prepare form data
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("address", address);
    formData.append("latitude", Number(latitude));
    formData.append("longitude", Number(longitude));

    // Add image if selected
    const file = photoInput.files[0];

    if (file) {
        formData.append("image", file);
    }

    // Disable submit button while submitting
    const submitBtn = complaintForm.querySelector(
        'button[type="submit"]'
    );

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${token}`
            },

            body: formData

        });

        const data = await response.json();

        // Handle expired or invalid login
        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Your session has expired. Please login again.");

            window.location.href = "login.html";
            return;
        }

        // Handle backend errors
        if (!response.ok) {

            alert(data.message || "Complaint submission failed.");
            return;
        }

        // Show success only after backend saves complaint
        const savedComplaint = data.complaint;

        successDetails.textContent =
            "Your complaint has been saved successfully. " +
            "Category: " + savedComplaint.category +
            ". Reference ID: " + savedComplaint._id;

        successMessage.hidden = false;
        complaintForm.hidden = true;

        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (error) {

        console.error("Complaint submission error:", error);

        alert("Unable to connect to the backend. Please try again.");

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Complaint →";

    }

});


// CLEAR FORM

complaintForm.addEventListener("reset", function() {

    imagePreview.innerHTML = "";

    latitudeInput.value = "";
    longitudeInput.value = "";

    locationStatus.textContent = "Location not captured yet.";
    locationStatus.style.color = "";

    locationBtn.textContent = "Get Current Location";
    locationBtn.disabled = false;

    successMessage.hidden = true;

});
