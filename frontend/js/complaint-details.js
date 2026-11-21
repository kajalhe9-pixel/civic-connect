
const API_URL = `${window.CIVIC_API_BASE_URL}/complaints`;

// GET COMPLAINT ID FROM URL
const params = new URLSearchParams(window.location.search);
const complaintId = params.get("id");

// GET HTML ELEMENTS
const statusBadge = document.getElementById("statusBadge");
const timeline = document.getElementById("timeline");
const remarksList = document.getElementById("remarksList");


// FORMAT DATE
function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// STATUS COLORS
function setStatus(status) {

    const statusColors = {
        "Pending": ["#fff0d5", "#a56600"],
        "In Progress": ["#e8f2ff", "#0866c6"],
        "Resolved": ["#e2f7ec", "#16834e"],
        "Rejected": ["#ffe5e5", "#c62828"]
    };

    statusBadge.textContent = status;

    const colors = statusColors[status] || ["#eeeeee", "#333333"];

    statusBadge.style.backgroundColor = colors[0];
    statusBadge.style.color = colors[1];
}


// ADD TIMELINE ITEM
function addTimelineItem(title, description, date, className) {

    const item = document.createElement("div");
    item.className = "timeline-item " + className;

    const dot = document.createElement("span");
    dot.className = "timeline-dot";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    const small = document.createElement("small");
    small.textContent = date;

    item.append(dot, heading, paragraph, small);

    timeline.appendChild(item);
}


// DISPLAY TIMELINE
function displayTimeline(complaint) {

    timeline.innerHTML = "";

    addTimelineItem(
        "Complaint Submitted",
        "Your complaint was successfully registered.",
        formatDate(complaint.createdAt),
        "completed"
    );

    addTimelineItem(
        "Current Complaint Status",
        "The latest status of your complaint is: " + complaint.status,
        formatDate(complaint.updatedAt),
        "active"
    );

}


// DISPLAY AUTHORITY REMARKS
function displayRemarks() {

    remarksList.innerHTML = "";

    const message = document.createElement("p");

    message.textContent =
        "No authority remarks are available yet.";

    remarksList.appendChild(message);

}


// DISPLAY UPLOADED IMAGE
function displayImage(imagePath) {

    const photoSection = document.querySelector(".photos-card");

    const placeholder = document.querySelector(".photo-placeholder");

    if (!imagePath) {
        placeholder.innerHTML = `
            <span>📷</span>
            <p>No photograph was uploaded for this complaint.</p>
        `;
        return;
    }

    // Convert stored upload path into a browser URL
    const imageUrl = imagePath.startsWith("http")
        ? imagePath
        : `${window.CIVIC_BACKEND_ORIGIN}/${imagePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;

    placeholder.innerHTML = "";

    const image = document.createElement("img");

    image.src = imageUrl;
    image.alt = "Complaint photograph";
    image.style.maxWidth = "100%";
    image.style.maxHeight = "350px";
    image.style.objectFit = "contain";
    image.style.borderRadius = "10px";

    image.onerror = function() {
        placeholder.textContent = "Unable to load the uploaded photograph.";
    };

    placeholder.appendChild(image);

}


// DISPLAY COMPLAINT DETAILS
function displayComplaint(complaint) {

    document.getElementById("complaintId").textContent =
        "CC-" + complaint._id.slice(-8).toUpperCase();

    document.getElementById("category").textContent =
        complaint.category;

    document.getElementById("complaintTitle").textContent =
        complaint.title;

    document.getElementById("description").textContent =
        complaint.description;

    document.getElementById("date").textContent =
        formatDate(complaint.createdAt);

    document.getElementById("location").textContent =
        complaint.location?.address || "Not available";

    document.getElementById("department").textContent =
        complaint.assignedDepartment || "Unassigned";

    document.getElementById("updated").textContent =
        formatDate(complaint.updatedAt);

    setStatus(complaint.status);

    displayTimeline(complaint);

    displayRemarks();

    displayImage(complaint.image);

}


// SHOW ERROR MESSAGE
function showError(message) {

    document.querySelector(".container").innerHTML = `
        <a href="my-complaints.html" class="back-link">
            ← Back to My Complaints
        </a>

        <section class="details-card">
            <h2>Unable to Load Complaint</h2>
            <p>${message}</p>
        </section>
    `;

}


// FETCH COMPLAINT FROM BACKEND
async function loadComplaintDetails() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    if (!complaintId) {
        showError("Complaint ID is missing.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${encodeURIComponent(complaintId)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Your session has expired. Please login again.");

            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Complaint not found.");
        }

        displayComplaint(data.complaint);

    } catch (error) {

        console.error("Complaint details error:", error);

        showError(error.message || "Unable to connect to the backend.");

    }

}


// START
loadComplaintDetails();
