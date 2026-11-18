
const API_URL = `${window.CIVIC_API_BASE_URL}/complaints`;

// STORE REAL COMPLAINTS FROM DATABASE
let complaints = [];

// GET ELEMENTS
const complaintList = document.getElementById("complaintList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const progressCount = document.getElementById("progressCount");
const resolvedCount = document.getElementById("resolvedCount");

const emptyState = document.getElementById("emptyState");

const detailsModal = document.getElementById("detailsModal");
const closeModal = document.getElementById("closeModal");


// SAFELY DISPLAY USER-SUBMITTED TEXT
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}


// FORMAT DATE
function formatDate(date) {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// FETCH MY COMPLAINTS FROM BACKEND
async function loadMyComplaints() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    try {

        complaintList.innerHTML = "<p>Loading your complaints...</p>";

        const response = await fetch(`${API_URL}/my`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Your session has expired. Please login again.");

            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Failed to load complaints");
        }

        complaints = data.complaints || [];

        updateCounts();
        filterComplaints();

    } catch (error) {

        console.error("My complaints error:", error);

        complaintList.innerHTML =
            "<p>Unable to load complaints. Please try again.</p>";

        alert(error.message || "Unable to connect to the backend.");

    }
}


// UPDATE COMPLAINT COUNTS
function updateCounts() {

    totalCount.textContent = complaints.length;

    pendingCount.textContent =
        complaints.filter(c => c.status === "Pending").length;

    progressCount.textContent =
        complaints.filter(c => c.status === "In Progress").length;

    resolvedCount.textContent =
        complaints.filter(c => c.status === "Resolved").length;
}


// GET STATUS CSS CLASS
function getStatusClass(status) {

    if (status === "Pending") return "pending";
    if (status === "In Progress") return "in-progress";
    if (status === "Resolved") return "resolved";

    return "";

}


// DISPLAY COMPLAINTS
function displayComplaints(data) {

    complaintList.innerHTML = "";

    if (data.length === 0) {
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    data.forEach(complaint => {

        const card = document.createElement("div");
        card.className = "complaint-card";

        const complaintId = complaint._id;

        const displayId =
            "CC-" + complaintId.slice(-8).toUpperCase();

        const title = escapeHTML(complaint.title);
        const category = escapeHTML(complaint.category);
        const description = escapeHTML(complaint.description);
        const address = escapeHTML(complaint.location?.address);
        const status = escapeHTML(complaint.status);

        const date = formatDate(complaint.createdAt);

        card.innerHTML = `
            <div class="complaint-card-header">

                <span class="complaint-id">
                    ${displayId}
                </span>

                <span class="status-badge ${getStatusClass(complaint.status)}">
                    ${status}
                </span>

            </div>

            <h3>${title}</h3>

            <p class="complaint-category">
                ${category}
            </p>

            <p class="complaint-description">
                ${description}
            </p>

            <div class="complaint-meta">

                <span>📍 ${address}</span>

                <span>📅 ${date}</span>

            </div>

            <a
                href="complaint-details.html?id=${encodeURIComponent(complaintId)}"
                class="view-details-btn"
            >
                View Details →
            </a>

            <button
                type="button"
                class="delete-complaint-btn"
                data-complaint-id="${escapeHTML(complaintId)}"
            >
                Delete Complaint
            </button>
        `;

        complaintList.appendChild(card);

    });

}


// SEARCH AND FILTER COMPLAINTS
function filterComplaints() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;

    const filtered = complaints.filter(complaint => {

        const complaintId =
            ("CC-" + complaint._id.slice(-8)).toLowerCase();

        const matchesSearch =
            complaintId.includes(searchValue) ||
            (complaint.title || "").toLowerCase().includes(searchValue) ||
            (complaint.category || "").toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            complaint.status === selectedStatus;

        const matchesCategory =
            selectedCategory === "all" ||
            complaint.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;

    });

    displayComplaints(filtered);

}


// SHOW COMPLAINT DETAILS IN MODAL
function showComplaintDetails(complaint) {

    if (!detailsModal) return;

    detailsModal.hidden = false;

    const modalContent =
        detailsModal.querySelector(".modal-content");

    if (modalContent) {

        const displayId =
            "CC-" + complaint._id.slice(-8).toUpperCase();

        modalContent.innerHTML = `
            <h2>${escapeHTML(complaint.title)}</h2>

            <p><strong>ID:</strong> ${displayId}</p>

            <p><strong>Category:</strong>
                ${escapeHTML(complaint.category)}
            </p>

            <p><strong>Description:</strong>
                ${escapeHTML(complaint.description)}
            </p>

            <p><strong>Location:</strong>
                ${escapeHTML(complaint.location?.address)}
            </p>

            <p><strong>Date:</strong>
                ${formatDate(complaint.createdAt)}
            </p>

            <p><strong>Status:</strong>
                ${escapeHTML(complaint.status)}
            </p>

            <a
                href="complaint-details.html?id=${encodeURIComponent(complaint._id)}"
                class="view-details-btn"
            >
                Open Full Details →
            </a>
        `;

    }

}


// EVENT LISTENERS
searchInput.addEventListener("input", filterComplaints);

statusFilter.addEventListener("change", filterComplaints);

categoryFilter.addEventListener("change", filterComplaints);

complaintList.addEventListener("click", async event => {
    const deleteButton = event.target.closest(".delete-complaint-btn");

    if (!deleteButton) return;

    const complaintId = deleteButton.dataset.complaintId;

    if (!window.confirm("Delete this complaint? This action cannot be undone.")) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    deleteButton.disabled = true;

    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(complaintId)}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete complaint");
        }

        complaints = complaints.filter(complaint => complaint._id !== complaintId);
        updateCounts();
        filterComplaints();

        if (data.warning) {
            alert(data.warning);
        }
    } catch (error) {
        console.error("Delete complaint error:", error);
        alert(error.message || "Unable to delete complaint. Please try again.");
    } finally {
        if (deleteButton.isConnected) {
            deleteButton.disabled = false;
        }
    }
});


if (closeModal) {

    closeModal.addEventListener("click", () => {
        detailsModal.hidden = true;
    });

}


if (detailsModal) {

    detailsModal.addEventListener("click", event => {

        if (event.target === detailsModal) {
            detailsModal.hidden = true;
        }

    });

}


document.addEventListener("keydown", event => {

    if (event.key === "Escape" && detailsModal) {
        detailsModal.hidden = true;
    }

});


// LOAD REAL COMPLAINTS
loadMyComplaints();
