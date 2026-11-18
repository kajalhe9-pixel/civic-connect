
const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user") || "null");


// CHECK ADMIN LOGIN

if (!token || !storedUser || storedUser.role !== "admin") {

    alert("Admin access only. Please login with an admin account.");

    window.location.href = "login.html";

}


// API REQUEST HELPER

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${API_URL}${endpoint}`, {

        ...options,

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers
        }

    });

    const data = await response.json();

    if (response.status === 401 || response.status === 403) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired or access denied. Please login again.");

        window.location.href = "login.html";

        throw new Error(data.message || "Access denied");

    }

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;

}


// DISPLAY ADMIN NAME

if (storedUser) {
    document.getElementById("adminName").textContent =
        storedUser.name || "Administrator";
}


// FORMAT DATE

function formatDate(date) {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// ESCAPE HTML

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


// LOAD DASHBOARD STATISTICS

async function loadDashboardStats() {

    try {

        const data = await apiRequest("/admin/dashboard");

        const stats = data.statistics;

        document.getElementById("totalComplaints").textContent =
            stats.totalComplaints;

        document.getElementById("pendingComplaints").textContent =
            stats.pendingComplaints;

        document.getElementById("progressComplaints").textContent =
            stats.inProgressComplaints;

        document.getElementById("resolvedComplaints").textContent =
            stats.resolvedComplaints;

        document.getElementById("rejectedComplaints").textContent =
            stats.rejectedComplaints;

        document.getElementById("totalUsers").textContent =
            stats.totalUsers;

    } catch (error) {

        console.error("Statistics error:", error);

    }

}


// LOAD ALL COMPLAINTS

async function loadComplaints() {

    const table = document.getElementById("complaintsTable");

    try {

        table.innerHTML =
            '<tr><td colspan="8">Loading complaints...</td></tr>';

        const data = await apiRequest("/admin/complaints");

        const complaints = data.complaints || [];

        if (complaints.length === 0) {

            table.innerHTML =
                '<tr><td colspan="8">No complaints found.</td></tr>';

            return;

        }

        table.innerHTML = complaints.map(function(complaint) {

            const complaintId = complaint._id;

            const displayId =
                "CC-" + complaintId.slice(-8).toUpperCase();

            const citizenName =
                complaint.user?.name || "Unknown Citizen";

            const status = complaint.status;

            const department =
                complaint.assignedDepartment || "Unassigned";

            return `

                <tr>

                    <td>${escapeHTML(displayId)}</td>

                    <td>${escapeHTML(citizenName)}</td>

                    <td>${escapeHTML(complaint.title)}</td>

                    <td>${escapeHTML(complaint.category)}</td>

                    <td>${formatDate(complaint.createdAt)}</td>

                    <td>
                        <span class="status ${getStatusClass(status)}">
                            ${escapeHTML(status)}
                        </span>
                    </td>

                    <td>${escapeHTML(department)}</td>

                    <td class="action-cell">

                        <select class="action-select"
                            id="status-${complaintId}">

                            <option value="Pending"
                                ${status === "Pending" ? "selected" : ""}>
                                Pending
                            </option>

                            <option value="In Progress"
                                ${status === "In Progress" ? "selected" : ""}>
                                In Progress
                            </option>

                            <option value="Resolved"
                                ${status === "Resolved" ? "selected" : ""}>
                                Resolved
                            </option>

                            <option value="Rejected"
                                ${status === "Rejected" ? "selected" : ""}>
                                Rejected
                            </option>

                        </select>

                        <button class="action-btn"
                            onclick="updateStatus('${complaintId}')">
                            Update
                        </button>

                        <select class="action-select"
                            id="department-${complaintId}">

                            ${["Roads", "Water Supply", "Electricity",
                                "Sanitation", "Street Lights", "Other"]
                                .map(function(dept) {

                                    return `
                                        <option value="${dept}"
                                            ${department === dept ? "selected" : ""}>
                                            ${dept}
                                        </option>
                                    `;

                                }).join("")}

                        </select>

                        <button class="action-btn"
                            onclick="assignDepartment('${complaintId}')">
                            Assign
                        </button>

                    </td>

                </tr>

            `;

        }).join("");

    } catch (error) {

        console.error("Complaints error:", error);

        table.innerHTML =
            '<tr><td colspan="8">Unable to load complaints.</td></tr>';

    }

}


// GET STATUS CLASS

function getStatusClass(status) {

    if (status === "Pending") return "pending";

    if (status === "In Progress") return "progress";

    if (status === "Resolved") return "resolved";

    if (status === "Rejected") return "rejected";

    return "";

}


// UPDATE COMPLAINT STATUS

async function updateStatus(complaintId) {

    const status = document.getElementById(
        `status-${complaintId}`
    ).value;

    try {

        const data = await apiRequest(
            `/admin/complaints/${complaintId}/status`,
            {
                method: "PATCH",
                body: JSON.stringify({ status })
            }
        );

        alert(data.message);

        await loadComplaints();
        await loadDashboardStats();

    } catch (error) {

        alert(error.message);

    }

}


// ASSIGN DEPARTMENT

async function assignDepartment(complaintId) {

    const department = document.getElementById(
        `department-${complaintId}`
    ).value;

    try {

        const data = await apiRequest(
            `/admin/complaints/${complaintId}/assign`,
            {
                method: "PATCH",
                body: JSON.stringify({ department })
            }
        );

        alert(data.message);

        await loadComplaints();

    } catch (error) {

        alert(error.message);

    }

}


// LOAD REGISTERED USERS

async function loadUsers() {

    const table = document.getElementById("usersTable");

    try {

        table.innerHTML =
            '<tr><td colspan="4">Loading users...</td></tr>';

        const data = await apiRequest("/admin/users");

        const users = data.users || [];

        if (users.length === 0) {

            table.innerHTML =
                '<tr><td colspan="4">No registered users found.</td></tr>';

            return;

        }

        table.innerHTML = users.map(function(user) {

            return `

                <tr>

                    <td>${escapeHTML(user.name)}</td>

                    <td>${escapeHTML(user.email)}</td>

                    <td>${escapeHTML(user.role)}</td>

                    <td>${formatDate(user.createdAt)}</td>

                </tr>

            `;

        }).join("");

    } catch (error) {

        console.error("Users error:", error);

        table.innerHTML =
            '<tr><td colspan="4">Unable to load users.</td></tr>';

    }

}


// REFRESH BUTTON

document.getElementById("refreshBtn").addEventListener("click", function() {

    loadComplaints();
    loadDashboardStats();

});


// MOBILE SIDEBAR

const sidebarToggle = document.getElementById("sidebarToggle");

const sidebar = document.getElementById("sidebar");

sidebarToggle.addEventListener("click", function() {

    sidebar.classList.toggle("open");

});


// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", function() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("citizenName");

        window.location.href = "login.html";

    }

});


// LOAD ALL ADMIN DATA

if (token && storedUser?.role === "admin") {

    loadDashboardStats();
    loadComplaints();
    loadUsers();

}
