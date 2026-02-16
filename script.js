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
            {id: 1, name: "Two Bedroom Apartment", bookings:[], },
            {id: 2, name: "One Bedroom Apartment", bookings:[], },
            {id: 3, name: "Studio Apartment", bookings:[], },
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
        const container = document.getElementById("room-container");
        container.innerHTML = "";

        let availableCount = 0;

        rooms.forEach(room => {
            const available = isRoomAvailable(room);
            if(available) availableCount++;

            const div = document.createElement("div");
            div.className = "room-card";

            div.innerHTML = `
                <h3>${room.name}</h3>
                <p>Status:
                     <strong class="${available ? 'available' : 'booked'}">
                     ${available ? "Available" : "Booked"}
                     </strong>
                </p>
                ${available
                    ? `<button onclick="bookRoom(${room.id})">Book Now</button>`
                    : `<button disabled>Unavailable</button>`}
            `;

            container.appendChild(div);
        });
        if (availableCount === 0){
            container.innerHTML = "<p>NO rooms available for selected dates.</p>";
        }
    }

    // Book room
    window.bookRoom = function (roomId) {

        rooms=rooms.map(room => {
            if (rooom.id === roomId){
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
        displayRooms("Room booked successfully!");
    };

    displayRooms();
});