// DEMO PUBLIC COMPLAINT DATA
// These are sample records and sample map coordinates.

const publicIssues = [
    {
        id: "CC-2001",
        title: "Pothole on Main Road",
        category: "Road Damage",
        description: "A large pothole is making the road unsafe for commuters.",
        location: "Karol Bagh, Delhi",
        date: "2026-11-01",
        status: "Pending",
        lat: 28.6519,
        lng: 77.1909
    },
    {
        id: "CC-2002",
        title: "Water Pipeline Leakage",
        category: "Water Problems",
        description: "Water is continuously leaking from a damaged pipeline.",
        location: "Patel Nagar, Delhi",
        date: "2026-11-02",
        status: "In Progress",
        lat: 28.6510,
        lng: 77.1690
    },
    {
        id: "CC-2003",
        title: "Streetlight Not Working",
        category: "Electricity",
        description: "Streetlights are not working near the residential area.",
        location: "Rajendra Place, Delhi",
        date: "2026-11-03",
        status: "Resolved",
        lat: 28.6420,
        lng: 77.1780
    },
    {
        id: "CC-2004",
        title: "Garbage Collection Issue",
        category: "Sanitation",
        description: "Garbage has not been collected for several days.",
        location: "Pusa Road, Delhi",
        date: "2026-11-04",
        status: "Pending",
        lat: 28.6380,
        lng: 77.1900
    },
    {
        id: "CC-2005",
        title: "Blocked Drainage",
        category: "Sanitation",
        description: "Drainage water is overflowing onto the road.",
        location: "Shadipur, Delhi",
        date: "2026-11-05",
        status: "In Progress",
        lat: 28.6515,
        lng: 77.1570
    },
    {
        id: "CC-2006",
        title: "Broken Road Divider",
        category: "Other",
        description: "A damaged road divider needs repair.",
        location: "Connaught Place, Delhi",
        date: "2026-11-06",
        status: "Resolved",
        lat: 28.6315,
        lng: 77.2167
    }
];

// GET HTML ELEMENTS

const locationSearch = document.getElementById("locationSearch");
const categoryFilter = document.getElementById("categoryFilter");
const resetFilters = document.getElementById("resetFilters");

const issuesList = document.getElementById("issuesList");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");

// MAP SETUP

const map = L.map("issuesMap").setView([28.644, 77.180], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

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
                <span>📅 ${escapeHTML(issue.date)}</span>
            </div>
        `;

        issuesList.appendChild(card);
    });
}

// DISPLAY MAP MARKERS

function displayMarkers(issues) {
    markerLayer.clearLayers();

    const bounds = [];

    issues.forEach(issue => {
        const marker = L.marker([issue.lat, issue.lng]);

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

        bounds.push([issue.lat, issue.lng]);
    });

    if (bounds.length > 0) {
        map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 14
        });
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

// INITIAL DISPLAY

displayIssues(publicIssues);
displayMarkers(publicIssues);