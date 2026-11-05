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


// PHOTO UPLOAD AND PREVIEW

photoInput.addEventListener("change", function() {

    imagePreview.innerHTML = "";

    const files = Array.from(photoInput.files);

    if (files.length > 5) {
        alert("You can upload a maximum of 5 photos.");
        photoInput.value = "";
        return;
    }

    for (const file of files) {

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Only JPG and PNG images are allowed.");
            photoInput.value = "";
            imagePreview.innerHTML = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Each image must be smaller than 5 MB.");
            photoInput.value = "";
            imagePreview.innerHTML = "";
            return;
        }

    }

    files.forEach(function(file) {

        const reader = new FileReader();

        reader.onload = function(event) {

            const image = document.createElement("img");

            image.src = event.target.result;

            image.alt = "Complaint photograph";

            imagePreview.appendChild(image);

        };

        reader.readAsDataURL(file);

    });

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


// GENERATE COMPLAINT ID

function generateComplaintId() {

    return "CC-" + Date.now().toString().slice(-8);

}


// SUBMIT COMPLAINT

complaintForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const category = document.getElementById("category").value;

    const title = document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const address = document.getElementById("address").value.trim();

    const latitude = latitudeInput.value;

    const longitude = longitudeInput.value;


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


    const complaintId = generateComplaintId();


    successDetails.textContent =
        "Your demonstration complaint ID is " + complaintId +
        ". Category: " + category + ".";


    successMessage.hidden = false;

    complaintForm.hidden = true;

    successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

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