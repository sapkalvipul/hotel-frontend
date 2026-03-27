import React, { useState } from "react";
import API from "../api/axiosConfig";

function BookingForm({ roomId, onClose }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  const createBooking = async () => {
    try {
      await API.post("/bookings/create", {
        room_id: roomId,
        checkin,
        checkout,
      });
      alert("Booking successful!");
      onClose();
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Book Room {roomId}</h2>

        <label>Check-in</label>
        <input type="date" onChange={(e) => setCheckin(e.target.value)} />

        <label>Check-out</label>
        <input type="date" onChange={(e) => setCheckout(e.target.value)} />

        <button className="auth-btn" onClick={createBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookingForm;
