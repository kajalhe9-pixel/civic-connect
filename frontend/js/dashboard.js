
const API_URL = window.CIVIC_API_BASE_URL;


// CITIZEN DETAILS

async function loadCitizenDetails() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Session expired. Please login again.");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            alert(data.message || "Unable to load profile");
            return;
        }

        const citizenName = data.user.name;

        document.getElementById("welcomeName").textContent = citizenName;
        document.getElementById("sidebarName").textContent = citizenName;
        document.getElementById("topbarName").textContent = citizenName;

        document.querySelectorAll(".profile-avatar").forEach(function(avatar) {
            avatar.textContent = citizenName.charAt(0).toUpperCase();
        });

        localStorage.setItem("user", JSON.stringify(data.user));

    } catch (error) {
        console.error("Profile loading error:", error);
        alert("Unable to connect to the backend.");
    }
}

loadCitizenDetails();


// FORMAT DATE

function formatDate(date) {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ESCAPE USER-SUBMITTED TEXT

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


// LOAD REAL COMPLAINTS FROM BACKEND

async function loadDashboardComplaints() {

    const token = localStorage.getItem("token");

    if (!token) return;

    const complaintsTable = document.getElementById("complaintsTable");

    try {

        complaintsTable.innerHTML =
            '<tr><td colspan="5">Loading complaints...</td></tr>';

        const response = await fetch(`${API_URL}/complaints`, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Session expired. Please login again.");

            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch complaints");
        }

        const complaints = data.complaints || [];

        // CALCULATE STATISTICS

        const total = complaints.length;

        const pending = complaints.filter(function(complaint) {
            return complaint.status === "Pending";
        }).length;

        const inProgress = complaints.filter(function(complaint) {
            return complaint.status === "In Progress";
        }).length;

        const resolved = complaints.filter(function(complaint) {
            return complaint.status === "Resolved";
        }).length;


        // UPDATE DASHBOARD COUNTS

        document.getElementById("totalComplaints").textContent = total;

        document.getElementById("pendingComplaints").textContent = pending;

        document.getElementById("progressComplaints").textContent = inProgress;

        document.getElementById("resolvedComplaints").textContent = resolved;


        // DISPLAY RECENT COMPLAINTS

        if (complaints.length === 0) {

            complaintsTable.innerHTML = `
                <tr>
                    <td colspan="5">No complaints submitted yet.</td>
                </tr>
            `;

            return;
        }

        // Backend already sorts complaints newest first.
        // Display the latest 5 complaints.

        const recentComplaints = complaints.slice(0, 5);

        complaintsTable.innerHTML = recentComplaints.map(function(complaint) {

            let statusClass = "";

            if (complaint.status === "Pending") {
                statusClass = "pending";
            } else if (complaint.status === "In Progress") {
                statusClass = "progress";
            } else if (complaint.status === "Resolved") {
                statusClass = "resolved";
            } else {
                statusClass = "rejected";
            }

            const displayId =
                "CC-" + complaint._id.slice(-8).toUpperCase();

            return `
                <tr>
                    <td>${displayId}</td>

                    <td>${escapeHTML(complaint.title)}</td>

                    <td>${escapeHTML(complaint.category)}</td>

                    <td>${formatDate(complaint.createdAt)}</td>

                    <td>
                        <span class="status ${statusClass}">
                            ${escapeHTML(complaint.status)}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");


    } catch (error) {

        console.error("Dashboard complaints error:", error);

        complaintsTable.innerHTML = `
            <tr>
                <td colspan="5">Unable to load complaints.</td>
            </tr>
        `;

    }
}

loadDashboardComplaints();


// MOBILE SIDEBAR

const sidebarToggle = document.getElementById("sidebarToggle");

const sidebar = document.getElementById("sidebar");

if (sidebarToggle && sidebar) {

    sidebarToggle.addEventListener("click", function() {
        sidebar.classList.toggle("open");
    });

}


// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function() {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("citizenName");

            window.location.href = "login.html";

        }

    });

}
