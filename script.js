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

