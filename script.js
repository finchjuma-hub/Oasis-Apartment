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



    