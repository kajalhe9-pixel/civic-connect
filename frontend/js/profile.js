const API_URL = "http://localhost:5000/api";

const profileStatus = document.getElementById("profileStatus");
const profileError = document.getElementById("profileError");
const profileDetails = document.getElementById("profileDetails");

function formatMemberDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

async function loadProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    profileStatus.hidden = false;
    profileStatus.textContent = "Loading your profile...";
    profileError.hidden = true;
    profileDetails.hidden = true;

    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
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
            throw new Error(data.message || "Unable to load your profile");
        }

        if (!data.user) {
            throw new Error("The server returned no profile information");
        }

        const user = data.user;
        const name = user.name || "Citizen";
        const initial = name.trim().charAt(0).toUpperCase() || "C";

        document.getElementById("profileName").textContent = name;
        document.getElementById("profileEmail").textContent = user.email || "Not available";
        document.getElementById("profileRole").textContent =
            user.role === "admin" ? "Administrator" : "Citizen";
        document.getElementById("profileCreatedAt").textContent =
            formatMemberDate(user.createdAt);

        document.getElementById("sidebarName").textContent = name;
        document.getElementById("topbarName").textContent = name;
        document.getElementById("sidebarAvatar").textContent = initial;
        document.getElementById("topbarAvatar").textContent = initial;

        localStorage.setItem("user", JSON.stringify(user));
        profileStatus.hidden = true;
        profileDetails.hidden = false;
    } catch (error) {
        console.error("Profile loading error:", error);
        profileStatus.hidden = true;
        profileError.textContent = error.message || "Unable to connect to the backend.";
        profileError.hidden = false;
    }
}

const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    if (!window.confirm("Are you sure you want to logout?")) {
        return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenName");
    window.location.href = "login.html";
});

loadProfile();
