// Get data
const searchData = JSON.parse(localStorage.getItem('searchData')) || {};

if (!searchData) {
    alert("No booking data found. Please search again.");
    window.location.href = "booking.html";
}