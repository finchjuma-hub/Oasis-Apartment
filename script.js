document.addEventListener("DOMContentLoaded", function () {

//   ROOMS

  const ROOM_LIST = [
    { id: 1, name: "Single Room", maxGuests: 1 },
    { id: 2, name: "Double Room", maxGuests: 2 },
    { id: 3, name: "Deluxe Room", maxGuests: 2 },
    { id: 4, name: "Family Room", maxGuests: 5 }
  ];
// ROOMS STORAGE

  if (!localStorage.getItem("rooms")) {
    const roomsWithBookings = ROOM_LIST.map(room => ({
      ...room,
      bookings: []
    }));
    localStorage.setItem("rooms", JSON.stringify(roomsWithBookings));
  }

//   BOOKING PAGE LOGIC

  const bookingForm = document.getElementById("booking-form");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const checkIn = document.getElementById("check-in").value;
      const checkOut = document.getElementById("check-out").value;
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

    return; 
  }

//   ROOM STATUS PAGE LOGIC

  const userData = JSON.parse(localStorage.getItem("userData"));
  const rooms = JSON.parse(localStorage.getItem("rooms"));
  const userInfo = document.getElementById("user-info");
  const roomsContainer = document.getElementById("rooms-container");

  // Prevent direct access without booking
  if (!userData) {
    alert("Please search for a room first.");
    window.location.href = "booking.html";
    return;
  }

//    USER INFO

  if (userInfo) {
    userInfo.innerHTML = `
      <strong>Name:</strong> ${userData.username}<br>
      <strong>Check-in:</strong> ${userData.checkIn}<br>
      <strong>Check-out:</strong> ${userData.checkOut}<br>
      <strong>Guests:</strong> ${userData.guests}<br><br>
      <button id="new-booking">Start New Booking</button>
      <hr>
    `;
  }

  document.addEventListener("click", function (e) {
    if (e.target.id === "new-booking") {
      localStorage.removeItem("userData");
      window.location.href = "booking.html";
    }
  });

//   ROOM AVAILABILITY

  function isRoomAvailable(room) {
    return !room.bookings.some(b => {
      const bookedIn = new Date(b.checkIn);
      const bookedOut = new Date(b.checkOut);
      const searchIn = new Date(userData.checkIn);
      const searchOut = new Date(userData.checkOut);
      return searchIn < bookedOut && searchOut > bookedIn;
    });
  }

//   DISPLAY ROOMS

  roomsContainer.innerHTML = "";

  rooms.forEach(room => {
    const available = isRoomAvailable(room);
    const div = document.createElement("div");
    div.className = "room-card";

    div.innerHTML = `
      <h3>${room.name}</h3>
      <p>Max guests: ${room.maxGuests}</p>
      <p>Status: <strong>${available ? "Available" : "Not Available"}</strong></p>
      ${available ? `<button onclick="bookRoom(${room.id})">Book Now</button>` : ""}
    `;

    roomsContainer.appendChild(div);
  });

//    BOOK ROOM

  window.bookRoom = function (roomId) {
    const rooms = JSON.parse(localStorage.getItem("rooms"));
    const room = rooms.find(r => r.id === roomId);

    room.bookings.push({
      username: userData.username,
      checkIn: userData.checkIn,
      checkOut: userData.checkOut
    });

    localStorage.setItem("rooms", JSON.stringify(rooms));
    localStorage.removeItem("userData");

    alert("Room booked successfully!");
    window.location.href = "booking.html";
  };

});
