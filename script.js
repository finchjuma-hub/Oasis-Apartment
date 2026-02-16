document.addEventListener("DOMContentLoaded", function (){

    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData){
        alert("No search data found. Please search for a room first.");
        window.location.href = "booking.html";
        return;
    }

    // Initialize rooms
    if (!localStorage.getItem("rooms")){
        const rooms = [
            {id: 1, name: "Two Bedroom Apartment", bookings:[] },
            {id: 2, name: "One Bedroom Apartment", bookings:[] },
            {id: 3, name: "Studio Apartment", bookings:[] }
        ];
        localStorage.setItem("rooms", JSON.stringify(rooms));
    }
    let rooms = JSON.parse(localStorage.getItem("rooms"));

    // USER INFO
    const userInfo = document.getElementById("user-info");

    if(userInfo){
        userInfo.innerHTML = `
            Username: <strong>${userData.username}</strong><br>
            Check-in: ${userData.checkIn}<br>
            Check-out: ${userData.checkOut}<br>
            Guests: ${userData.guests}
        `;
    }

    // Room Availability
    function isRoomAvailable(room){
        return !room.bookings.some(b => {
            const bookedIn = new Date(b.checkIn);
            const bookedOut = new Date(b.checkOut);
            const searchIn = new Date(userData.checkIn);
            const searchOut = new Date(userData.checkOut);

            return (searchIn < bookedOut && searchOut > bookedIn);
        });
    }

    // Display rooms
    function displayRooms(){
        const container = document.getElementById("rooms-container");
        container.innerHTML = "";

        rooms.forEach(room => {
            const available = isRoomAvailable(room);

            const div =  document.createElement("div");
            div.className = "room-card";

            // All existing bookings
            let bookingHistory = "";
            if (room.bookings.length > 0){
                bookingHistory = "<p><strong>Booked Dates:</strong></p>";
                room.bookings.forEach((b, index) => {
                    bookingHistory += `
                        <p>
                        ${b.checkIn} - ${b.checkOut}
                        (by ${b.username})
                        ${b.username === userData.username
                            ? `button onclick="cancelBooking(${room.id}, ${index})">Cancel</button>`
                            : ""}
                        </p>`
                    `;`    
                });
            }

            div.innerHTML = `
                <h3>${room.name}</h3>
                <p>Status:
                    <strong class="${available ? 'available' : 'booked'}">
                        ${available ? "Available" : "NOt Available"}
                        </strong>
                </p>
                ${available
                    ? `<button onclick="bookRoom(${room.id})">Book Now</button>
                    : ""}
                    ${bookingHistory}
            `;

            container.appendChild(div);
        });
    }
         

    // Book room
    window.bookRoom = function (roomId) {

        rooms=rooms.map(room => {
            if (room.id === roomId){
                room.bookings.push({
                    checkIn: userData.checkIn,
                    checkOut: userData.checkOut,
                    guests: userData.guests,
                    username: userData.username,
                });    
            }
            return room;
        });

        localStorage.setItem("rooms", JSON.stringify(rooms));
        alert("Room booked successfully!");
        displayRooms();
    };

    displayRooms();
});