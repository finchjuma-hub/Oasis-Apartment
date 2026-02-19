document.addEventListener("DOMContentLoaded", function () {

    //  BOOKING PAGE LOGIC

    const bookingForm = document.getElementById("booking-form");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const checkIn = document.getElementById("checkin").value;
            const checkOut = document.getElementById("checkout").value;
            const guests = document.getElementById("guests").value;

            if (!username || !checkIn || !checkOut || !guests) {
                alert("Please fill in all fields.");
                return;
            }

            localStorage.setItem("userData", JSON.stringify({
                username,
                checkIn,
                checkOut,
                guests
            }));

            window.location.href = "roomstatus.html";
        });
    }

    //  ROOM STATUS PAGE LOGIC

    const roomsContainer = document.getElementById("rooms-container");
    const userInfo = document.getElementById("user-info");

    // 🚨 IMPORTANT: do NOT return the whole script
    if (!roomsContainer || !userInfo) {
        return; // only exits room-status logic, booking still works
    }

    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
        alert("Please search for a room first.");
        window.location.href = "booking.html";
        return;
    }

    // Initialize rooms
    if (!localStorage.getItem("rooms")) {
        localStorage.setItem("rooms", JSON.stringify([
            { id: 1, name: "Single Room", bookings: [] },
            { id: 2, name: "Double Room", bookings: [] },
            { id: 3, name: "Deluxe Room", bookings: [] },
            { id: 4, name: "Family Room", bookings: [] }
        ]));
    }

    let rooms = JSON.parse(localStorage.getItem("rooms"));

    // Show user info
    userInfo.innerHTML = `
        <strong>${userData.username}</strong><br>
        Check-in: ${userData.checkIn}<br>
        Check-out: ${userData.checkOut}<br>
        Guests: ${userData.guests}<br><br>
        <button id="clear-booking">Start New Booking</button>
        <hr>
    `;

    document.getElementById("clear-booking").onclick = function () {
        localStorage.removeItem("userData");
        window.location.href = "booking.html";
    };

    function isRoomAvailable(room) {
        return !room.bookings.some(b =>
            new Date(userData.checkIn) < new Date(b.checkOut) &&
            new Date(userData.checkOut) > new Date(b.checkIn)
        );
    }

    function displayRooms() {
        roomsContainer.innerHTML = "";

        rooms.forEach(room => {
            const available = isRoomAvailable(room);

            const div = document.createElement("div");
            div.className = "room-card";

            div.innerHTML = `
                <h3>${room.name}</h3>
                <p>Status: <strong>${available ? "Available" : "Not Available"}</strong></p>
                ${available ? `<button onclick="bookRoom(${room.id})">Book Now</button>` : ""}
            `;

            roomsContainer.appendChild(div);
        });
    }

    window.bookRoom = function (roomId) {
        const room = rooms.find(r => r.id === roomId);

        if (!isRoomAvailable(room)) {
            alert("Room no longer available.");
            return;
        }

        room.bookings.push({ ...userData });

        localStorage.setItem("rooms", JSON.stringify(rooms));
        localStorage.removeItem("userData");

        alert("Room booked successfully!");
        window.location.href = "booking.html";
    };

    displayRooms();
});
``
