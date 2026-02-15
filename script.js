document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("booking-form");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get Values
        const checkIn = document.getElementById("check-in").value;
        const checkOut = document.getElementById("check-out").value;
        const guests = document.getElementById("guests").value;

        // Log in info
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Validate
        if (!checkIn || !checkOut || !guests || !username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Save to local storage
        localStorage.setItem("searchData", JSON.stringify({
            checkIn: checkIn,
            checkOut: checkOut,
            guests: guests
        }));

        // Redirect to room status page
        window.location.href = "roomstatus.html";
    });
});

// Get data
const searchData = JSON.parse(localStorage.getItem("searchData"));
if (!searchData) {
    alert("No booking data found. Please search again.");
    window.location.href = "booking.html";
}

// Initialize rooms
if (!localStorage.getItem("rooms")) {
    const rooms = [
        { id: 1, type: "Two Bedroom", price: 4500, available: true },
        { id: 2, type: "One Bedroom", price: 3500, available: true },
        { id: 3, type: "Studio Apartment", price: 2500, available: true }
    ];
    localStorage.setItem("rooms", JSON.stringify(rooms));
}

// Load stored room data
let rooms = JSON.parse(localStorage.getItem("rooms"));

// Get HTML containers
const roomStatusContainer = document.getElementById("room-status-container");
const searchInfo = document.getElementById("search-info");

// Booking Details
searchInfo.innerHTML = `
    <p><Strong>Check-in:</Strong> ${searchData.checkIn}</p>
    <p><Strong>Check-out:</Strong> ${searchData.checkOut}</p>
    <p><Strong>Guests:</Strong> ${searchData.guests}</p>
`;

// Display booking summary
function isRoomAvailable(room) {
    return !room.bookings.some(b => {
        const bookedCheckIn = new Date(b.checkIn);
        const bookedCheckOut = new Date(b.checkOut);
        const searchCheckIn = new Date(searchData.checkIn);
        const searchCheckOut = new Date(searchData.checkOut);

        return !(searchCheckOut <= bookedCheckIn || searchCheckIn >= bookedCheckOut);
    });
    }

// Display room status
function isRoomAvailable(room) {
    return !room.bookings.some(b => 
        !(searchData.checkOut <= b.checkIn ||
            searchData.checkIn >= b.checkOut)
    );
}

// Show rooms
function displayRooms() {
    roomStatusContainer.innerHTML = "";

    rooms.forEach(room => {
        const available = isRoomAvailable(room);

        const div = document.createElement("div");
        div.className = "room-card";

        div.innerHTML = `
            <h3>${room.name}</h3>
            <p>Status: <strong>${available ? "Available" : "Booked"}</strong></p>
            ${
                available
                ? `<button onclick="bookRoom(${room.id})">Book Now</button>`
                : `<button disabled>Unavailable</button>`
            }
            ${
                room.bookings.length
                  ? `<button onclick="cancelBooking(${room.id})"Cancel Booking</button>`
                    : ""
            }
        `;

        roomStatusContainer.appendChild(div);
    });
}

function displayRooms() {
    roomStatusContainer.innerHTML = "";
    let availableCount = 0;

    rooms.forEach(room => {
        const available = isRoomAvailable(room);
        if (available) availableCount++;

        const div = document.createElement("div");
        div.className = "room-card";

        div.innerHTML = `
            <h3>${room.type}</h3>
            <p>Price: $${room.price} / night</p>
            <p>Status: <strong>${available ? "Available" : "Booked"}</strong></p>
            ${
                available
                ? `<button onclick="bookRoom(${room.id})">Book Now</button>`
                : `<button disabled>Unavailable</button>`
            }
            ${
                room.bookings.length
                  ? `<button onclick="cancelBooking(${room.id})">Cancel Booking</button>`
                    : ""
            }
        `;

        roomStatusContainer.appendChild(div);
    });

    if (availableCount === 0) {
        roomStatusContainer.innerHTML = "<p>Sorry, no rooms are available for the selected dates.</p>";
    }
}

// Room Booking
function bookRoom(roomId) {

    // Add new booking
    rooms = rooms.map(room => {
        if (room.id === roomId) {
            room.bookings.push({
                checkIn: searchData.checkIn,
                checkOut: searchData.checkOut,
                guests: searchData.guests
            });
        }
        return room;
    });

    // Save updated rooms
    localStorage.setItem("rooms", JSON.stringify(rooms));

    alert("Room booked successfully!");
    displayRooms();
}

// Cancelling Booking
function cancelBooking(roomId) {

    if (!confirm("Cancel this booking?")) return;

    rooms = rooms.map(room => {
        if (room.id === roomId) {
            room.bookings = [];
        }
        return room;
    });

    localStorage.setItem("rooms", JSON.stringify(rooms));
    alert("Booking cancelled.");
    displayRooms();
}

// Reset
document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("Reset all bookings? This cannot be undone.")) return;

    localStorage.removeItem("rooms");
    location.reload();
});

// Initial display
displayRooms();