const complaints = {

    "CC-1001": {
        id: "CC-1001",
        category: "Road Damage",
        title: "Large pothole on main road",
        description: "A large pothole has developed on the main road, creating difficulties for vehicles and pedestrians.",
        date: "01 November 2026",
        location: "Delhi, India",
        department: "Road Maintenance Department",
        updated: "03 November 2026",
        status: "Pending",
        progress: 1,

        timeline: [
            {
                title: "Complaint Submitted",
                description: "Your complaint has been successfully registered.",
                date: "01 November 2026"
            },
            {
                title: "Under Review",
                description: "The complaint is waiting for review by the concerned department.",
                date: "Awaiting update"
            },
            {
                title: "Work In Progress",
                description: "Repair work has not started yet.",
                date: "Awaiting update"
            },
            {
                title: "Resolved",
                description: "The complaint will be marked resolved after the repair.",
                date: "Awaiting update"
            }
        ],

        remarks: [
            {
                title: "Complaint Received",
                message: "Your complaint has been received. The concerned department will review it."
            }
        ]
    },

    "CC-1002": {
        id: "CC-1002",
        category: "Water Problems",
        title: "Water leakage near residential area",
        description: "Continuous water leakage has been observed near the residential area. It is causing water wastage and inconvenience.",
        date: "02 November 2026",
        location: "Delhi, India",
        department: "Water Department",
        updated: "04 November 2026",
        status: "In Progress",
        progress: 3,

        timeline: [
            {
                title: "Complaint Submitted",
                description: "Your complaint has been successfully registered.",
                date: "02 November 2026"
            },
            {
                title: "Under Review",
                description: "The complaint has been reviewed by the water department.",
                date: "03 November 2026"
            },
            {
                title: "Work In Progress",
                description: "The maintenance team has been assigned to inspect the leakage.",
                date: "04 November 2026"
            },
            {
                title: "Resolved",
                description: "The complaint will be marked resolved after the leakage is fixed.",
                date: "Awaiting update"
            }
        ],

        remarks: [
            {
                title: "04 November 2026",
                message: "A maintenance team has been assigned. The issue is currently being inspected."
            },
            {
                title: "03 November 2026",
                message: "Your complaint has been reviewed by the concerned department."
            }
        ]
    },

    "CC-1003": {
        id: "CC-1003",
        category: "Streetlights",
        title: "Streetlight not working",
        description: "The streetlight near the residential lane is not functioning, making the area dark at night.",
        date: "30 October 2026",
        location: "Delhi, India",
        department: "Electrical Department",
        updated: "02 November 2026",
        status: "Resolved",
        progress: 4,

        timeline: [
            {
                title: "Complaint Submitted",
                description: "Your complaint has been successfully registered.",
                date: "30 October 2026"
            },
            {
                title: "Under Review",
                description: "The electrical department reviewed the complaint.",
                date: "31 October 2026"
            },
            {
                title: "Work In Progress",
                description: "The repair team inspected and repaired the streetlight.",
                date: "01 November 2026"
            },
            {
                title: "Resolved",
                description: "The streetlight has been repaired.",
                date: "02 November 2026"
            }
        ],

        remarks: [
            {
                title: "Resolution Update",
                message: "The streetlight has been repaired. Thank you for reporting the issue."
            }
        ]
    }

};

const params = new URLSearchParams(window.location.search);

const id = params.get("id") || "CC-1002";

const complaint = complaints[id];

const statusBadge = document.getElementById("statusBadge");

if (!complaint) {

    document.querySelector(".container").innerHTML = `
        <a href="my-complaints.html" class="back-link">
            ← Back to My Complaints
        </a>

        <section class="details-card">
            <h2>Complaint Not Found</h2>
            <p>Please check the complaint ID and try again.</p>
        </section>
    `;

} else {

    document.getElementById("complaintId").textContent = complaint.id;

    document.getElementById("category").textContent = complaint.category;

    document.getElementById("complaintTitle").textContent = complaint.title;

    document.getElementById("description").textContent = complaint.description;

    document.getElementById("date").textContent = complaint.date;

    document.getElementById("location").textContent = complaint.location;

    document.getElementById("department").textContent = complaint.department;

    document.getElementById("updated").textContent = complaint.updated;

    statusBadge.textContent = complaint.status;

    const statusColors = {
        "Pending": ["#fff0d5", "#a56600"],
        "In Progress": ["#e8f2ff", "#0866c6"],
        "Resolved": ["#e2f7ec", "#16834e"]
    };

    const colors = statusColors[complaint.status];

    statusBadge.style.backgroundColor = colors[0];

    statusBadge.style.color = colors[1];

    const timeline = document.getElementById("timeline");

    complaint.timeline.forEach((step, index) => {

        const item = document.createElement("div");

        let className = "timeline-item";

        if (index < complaint.progress) {
            className += " completed";
        }

        if (index === complaint.progress - 1) {
            className += " active";
        }

        item.className = className;

        item.innerHTML = `
            <span class="timeline-dot"></span>
            <h3></h3>
            <p></p>
            <small></small>
        `;

        item.querySelector("h3").textContent = step.title;

        item.querySelector("p").textContent = step.description;

        item.querySelector("small").textContent = step.date;

        timeline.appendChild(item);

    });

    const remarksList = document.getElementById("remarksList");

    complaint.remarks.forEach(remark => {

        const div = document.createElement("div");

        div.className = "remark";

        const heading = document.createElement("h3");

        heading.textContent = remark.title;

        const paragraph = document.createElement("p");

        paragraph.textContent = remark.message;

        div.append(heading, paragraph);

        remarksList.appendChild(div);

    });

}