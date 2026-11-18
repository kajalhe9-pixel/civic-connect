const API_URL = `${window.CIVIC_API_BASE_URL}/complaints`;
let publicIssues = [];

// GET HTML ELEMENTS

const locationSearch = document.getElementById("locationSearch");
const categoryFilter = document.getElementById("categoryFilter");
const resetFilters = document.getElementById("resetFilters");

const issuesList = document.getElementById("issuesList");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const mapStatus = document.getElementById("mapStatus");

// MAP SETUP

let map;
let markerLayer;

if (typeof L !== "undefined") {
    map = L.map("issuesMap").setView([28.644, 77.180], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
} else {
    mapStatus.textContent = "The map could not be loaded. Issue locations are listed below.";
}

// ESCAPE HTML TO DISPLAY TEXT SAFELY

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

function formatDate(date) {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// STATUS CLASS

function getStatusClass(status) {
    if (status === "Pending") {
        return "status-pending";
    }

    if (status === "In Progress") {
        return "status-in-progress";
    }

    if (status === "Resolved") {
        return "status-resolved";
    }

    return "";
}

// DISPLAY ISSUE CARDS

function displayIssues(issues) {
    issuesList.innerHTML = "";

    if (issues.length === 0) {
        emptyMessage.hidden = false;
        resultCount.textContent = "0 complaints found";
        return;
    }

    emptyMessage.hidden = true;

    resultCount.textContent =
        `${issues.length} public complaints found`;

    issues.forEach(issue => {
        const card = document.createElement("div");

        card.className = "issue-card";

        card.innerHTML = `
            <div class="issue-top">
                <span class="issue-id">
                    ${escapeHTML(issue.id)}
                </span>

                <span class="issue-status ${getStatusClass(issue.status)}">
                    ${escapeHTML(issue.status)}
                </span>
            </div>

            <h3>${escapeHTML(issue.title)}</h3>

            <span class="issue-category">
                ${escapeHTML(issue.category)}
            </span>

            <p>${escapeHTML(issue.description)}</p>

            <div class="issue-meta">
                <span>📍 ${escapeHTML(issue.location)}</span>
                <span>📅 ${formatDate(issue.date)}</span>
            </div>
        `;

        issuesList.appendChild(card);
    });
}

// DISPLAY MAP MARKERS

function displayMarkers(issues) {
    if (!markerLayer) return;

    markerLayer.clearLayers();

    const bounds = [];
    let markerCount = 0;

    issues.forEach(issue => {
        const latitude = Number(issue.lat);
        const longitude = Number(issue.lng);

        if (
            issue.lat === null ||
            issue.lat === undefined ||
            issue.lng === null ||
            issue.lng === undefined ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return;
        }

        const marker = L.marker([latitude, longitude]);

        marker.bindPopup(`
            <strong>${escapeHTML(issue.title)}</strong>
            <br>
            ${escapeHTML(issue.category)}
            <br>
            ${escapeHTML(issue.location)}
            <br>
            Status: ${escapeHTML(issue.status)}
            <br>
            ID: ${escapeHTML(issue.id)}
        `);

        marker.addTo(markerLayer);

        bounds.push([latitude, longitude]);
        markerCount += 1;
    });

    if (bounds.length > 0) {
        map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 14
        });
        mapStatus.textContent = `${markerCount} issue location(s) shown on the map.`;
    } else {
        mapStatus.textContent =
            "No matching reports have GPS coordinates. Available addresses are shown on the issue cards.";
    }
}

// SEARCH AND FILTER

function filterIssues() {
    const searchValue = locationSearch.value.trim().toLowerCase();

    const selectedCategory = categoryFilter.value;

    const filteredIssues = publicIssues.filter(issue => {

        const matchesSearch =
            issue.title.toLowerCase().includes(searchValue) ||
            issue.description.toLowerCase().includes(searchValue) ||
            issue.location.toLowerCase().includes(searchValue) ||
            issue.id.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            issue.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayIssues(filteredIssues);
    displayMarkers(filteredIssues);
}

// EVENT LISTENERS

locationSearch.addEventListener("input", filterIssues);

categoryFilter.addEventListener("change", filterIssues);

resetFilters.addEventListener("click", () => {
    locationSearch.value = "";
    categoryFilter.value = "all";

    filterIssues();
});

async function loadPublicIssues() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        resultCount.textContent = "Loading complaints...";

        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Failed to load reported issues");
        }

        publicIssues = (data.complaints || []).map(complaint => ({
            id: `CC-${String(complaint._id).slice(-8).toUpperCase()}`,
            title: complaint.title || "Untitled issue",
            category: complaint.category || "Other",
            description: complaint.description || "",
            location: complaint.location?.address || "Address not provided",
            date: complaint.createdAt,
            status: complaint.status || "Pending",
            lat: complaint.location?.latitude,
            lng: complaint.location?.longitude
        }));

        filterIssues();
    } catch (error) {
        console.error("Explore issues loading error:", error);
        resultCount.textContent = "Unable to load reported issues.";
        issuesList.textContent =
            error.message || "Please check your connection and try again.";
        emptyMessage.hidden = true;
    }
}

loadPublicIssues();