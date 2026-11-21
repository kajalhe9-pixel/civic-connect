const isLocalDevelopment =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

window.CIVIC_API_BASE_URL = isLocalDevelopment
    ? "http://localhost:5000/api"
    : "/api";

window.CIVIC_BACKEND_ORIGIN = isLocalDevelopment
    ? "http://localhost:5000"
    : "";
