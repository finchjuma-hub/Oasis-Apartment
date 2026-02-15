// Get data
const searchData = JSON.parse(localStorage.getItem('searchData')) || {};

if (!searchData) {
    alert("No booking data found. Please search again.");
    window.location.href = "booking.html";
}

// Initialize rooms
if (!localStorage.getItem('rooms')) {
    const rooms = [
        { id: 1, type: 'Two Bedroom', price: 4500, available: true },
        { id: 2, type: 'One Bedroom', price: 3500, available: true },
        { id: 3, type: 'Studio Apartment', price: 2500, available: true }
    ];
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Load stored room data
let rooms = JSON.parse(localStorage.getItem('rooms'));

