const complaints = [
    {
        id: "CC-1001",
        title: "Pothole on Main Road",
        category: "Road Damage",
        description: "A large pothole is causing problems for vehicles and pedestrians.",
        location: "Main Road, Delhi",
        date: "2026-10-20",
        status: "Pending"
    },
    {
        id: "CC-1002",
        title: "Water Leakage",
        category: "Water Problems",
        description: "Continuous water leakage from a damaged pipeline.",
        location: "Sector 12, Delhi",
        date: "2026-10-22",
        status: "In Progress"
    },
    {
        id: "CC-1003",
        title: "Streetlight Not Working",
        category: "Electricity",
        description: "The streetlight has not been working for several days.",
        location: "Near Community Park, Delhi",
        date: "2026-10-23",
        status: "Resolved"
    },
    {
        id: "CC-1004",
        title: "Garbage Collection Issue",
        category: "Sanitation",
        description: "Garbage has not been collected from the area regularly.",
        location: "Block A, Delhi",
        date: "2026-10-24",
        status: "Pending"
    },
    {
        id: "CC-1005",
        title: "Blocked Drainage",
        category: "Sanitation",
        description: "The drainage system is blocked and dirty water is overflowing.",
        location: "Sector 8, Delhi",
        date: "2026-10-25",
        status: "In Progress"
    },
    {
        id: "CC-1006",
        title: "Electricity Pole Repair",
        category: "Electricity",
        description: "An electricity pole needs maintenance.",
        location: "Near City Market, Delhi",
        date: "2026-10-26",
        status: "Resolved"
    }
];

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

function updateCounts() {
    totalCount.textContent = complaints.length;

    pendingCount.textContent =
        complaints.filter(c => c.status === "Pending").length;

    progressCount.textContent =
        complaints.filter(c => c.status === "In Progress").length;

    resolvedCount.textContent =
        complaints.filter(c => c.status === "Resolved").length;
}

function getStatusClass(status) {
    if (status === "Pending") return "pending";
    if (status === "In Progress") return "in-progress";
    if (status === "Resolved") return "resolved";

    return "";
}

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

        card.innerHTML = `
            <div class="complaint-card-header">
                <span class="complaint-id">${complaint.id}</span>

                <span class="status-badge ${getStatusClass(complaint.status)}">
                    ${complaint.status}
                </span>
            </div>

            <h3>${complaint.title}</h3>

            <p class="complaint-category">${complaint.category}</p>

            <p class="complaint-description">
                ${complaint.description}
            </p>

            <div class="complaint-meta">
                <span>📍 ${complaint.location}</span>
                <span>📅 ${complaint.date}</span>
            </div>

            <a
                href="complaint-details.html?id=${encodeURIComponent(complaint.id)}"
                class="view-details-btn"
            >
                View Details →
            </a>
        `;

        complaintList.appendChild(card);
    });
}

function filterComplaints() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;

    const filtered = complaints.filter(complaint => {
        const matchesSearch =
            complaint.id.toLowerCase().includes(searchValue) ||
            complaint.title.toLowerCase().includes(searchValue) ||
            complaint.category.toLowerCase().includes(searchValue);

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

function showComplaintDetails(complaint) {
    if (!detailsModal) return;

    detailsModal.hidden = false;

    const modalContent = detailsModal.querySelector(".modal-content");

    if (modalContent) {
        modalContent.innerHTML = `
            <h2>${complaint.title}</h2>
            <p><strong>ID:</strong> ${complaint.id}</p>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <p><strong>Location:</strong> ${complaint.location}</p>
            <p><strong>Date:</strong> ${complaint.date}</p>
            <p><strong>Status:</strong> ${complaint.status}</p>
            <a href="complaint-details.html?id=${encodeURIComponent(complaint.id)}"
               class="view-details-btn">
               Open Full Details →
            </a>
        `;
    }
}

searchInput.addEventListener("input", filterComplaints);
statusFilter.addEventListener("change", filterComplaints);
categoryFilter.addEventListener("change", filterComplaints);

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

updateCounts();
displayComplaints(complaints);