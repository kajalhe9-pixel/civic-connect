// CITIZEN DETAILS

const citizenName = localStorage.getItem("citizenName") || "Citizen";

document.getElementById("welcomeName").textContent = citizenName;
document.getElementById("sidebarName").textContent = citizenName;
document.getElementById("topbarName").textContent = citizenName;

document.querySelectorAll(".profile-avatar").forEach(function(avatar) {
    avatar.textContent = citizenName.charAt(0).toUpperCase();
});


// SAMPLE COMPLAINT DATA

const complaints = [
    {
        id: "CC-1001",
        issue: "Road Pothole",
        category: "Road Damage",
        date: "05 Nov 2026",
        status: "Pending"
    },
    {
        id: "CC-1002",
        issue: "Water Leakage",
        category: "Water",
        date: "03 Nov 2026",
        status: "In Progress"
    },
    {
        id: "CC-1003",
        issue: "Streetlight Repair",
        category: "Electricity",
        date: "01 Nov 2026",
        status: "Resolved"
    },
    {
        id: "CC-1004",
        issue: "Garbage Collection",
        category: "Garbage",
        date: "30 Oct 2026",
        status: "Pending"
    }
];


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


document.getElementById("totalComplaints").textContent = total;

document.getElementById("pendingComplaints").textContent = pending;

document.getElementById("progressComplaints").textContent = inProgress;

document.getElementById("resolvedComplaints").textContent = resolved;


// DISPLAY COMPLAINTS TABLE

const complaintsTable = document.getElementById("complaintsTable");

complaintsTable.innerHTML = complaints.map(function(complaint) {

    let statusClass = "";

    if (complaint.status === "Pending") {
        statusClass = "pending";
    } else if (complaint.status === "In Progress") {
        statusClass = "progress";
    } else {
        statusClass = "resolved";
    }

    return `
        <tr>
            <td>${complaint.id}</td>
            <td>${complaint.issue}</td>
            <td>${complaint.category}</td>
            <td>${complaint.date}</td>
            <td>
                <span class="status ${statusClass}">
                    ${complaint.status}
                </span>
            </td>
        </tr>
    `;

}).join("");


// MOBILE SIDEBAR

const sidebarToggle = document.getElementById("sidebarToggle");

const sidebar = document.getElementById("sidebar");

sidebarToggle.addEventListener("click", function() {
    sidebar.classList.toggle("open");
});


// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "login.html";
    }

});