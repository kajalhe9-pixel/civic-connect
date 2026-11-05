console.log("Welcome to Civic-Connect!");

const getStartedButton = document.querySelector(".primary-btn");

getStartedButton.addEventListener("click", function (event) {
    event.preventDefault();

    alert("Welcome to Civic-Connect! Registration is coming soon.");
});