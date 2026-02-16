document.addEventListener("DOMContentLoaded", function (){

    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData){
        alert("No search data found. Please search for a room first.");
        window.location.href = "booking.html";
        return;
    }
