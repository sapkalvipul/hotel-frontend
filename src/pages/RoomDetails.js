import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBed, FaWifi, FaParking, FaCoffee, FaArrowLeft, FaSnowflake } from "react-icons/fa";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(""); // "advance" or "full"
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkin: "",
    checkout: "",
    guests: 1
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/rooms`);
      try {
        const detailRes = await API.get(`/rooms/${id}`);
        setRoom(detailRes.data);
      } catch (e) {
        const found = res.data.find(r => r.id === parseInt(id));
        setRoom(found);
      }
      setLoading(false);
    } catch (err) {
      setRoom({
        id: parseInt(id),
        name: "Fallback Room (Server Offline)",
        category: "Standard",
        price: 5000,
        description: "This is a fallback view because the server is not reachable.",
        amenities: ["Wifi", "TV"],
        images: [],
        ac_type: "AC"
      });
      setLoading(false);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!bookingData.checkin || !bookingData.checkout) {
      alert("Please select dates");
      return;
    }
    setBookingStep(2);
  };

  const handleChooseMethod = async () => {
    if (!paymentMethod) {
      alert("Please select a payment option");
      return;
    }

    const amount = paymentMethod === "advance" ? advanceAmount : totalAmount;

    try {
      setBookingLoading(true);
      // 1. Create Order on Backend
      const { data } = await API.post("/payments/create-order", { amount });

      if (!data.success) {
        throw new Error(data.message);
      }

      const order = data.order;

      // 2. Open Razorpay CheckOut
      const options = {
        key: "rzp_test_SKQdNXMk1W1jrf", // From user request
        amount: order.amount,
        currency: order.currency,
        name: "Hotel Booking System",
        description: `${paymentMethod === "advance" ? "10% Advance" : "Full"} Payment for ${room.name}`,
        order_id: order.id,
        handler: async (response) => {
          // On Payment Success
          try {
            // Here we could verify payment on backend, but following simple flow
            await executeFinalBooking(response.razorpay_payment_id);
          } catch (err) {
            alert("Booking confirmation failed after payment");
          }
        },
        prefill: {
          name: "Guest",
          email: "guest@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong while initiating payment");
    } finally {
      setBookingLoading(false);
    }
  };

  const executeFinalBooking = async (razorpay_payment_id = null) => {
    try {
      setBookingLoading(true);
      await API.post("/bookings/create", {
        room_id: room.id,
        checkin: bookingData.checkin,
        checkout: bookingData.checkout,
        payment_type: paymentMethod,
        payment_gateway: "razorpay",
        payment_status: "completed",
        status: "confirmed",
        payment_id: razorpay_payment_id
      });

      setPaymentSuccess(true);
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed during payment");
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader fullPage={true} />;
  if (error || !room) return <div className="layout-main" style={{ padding: "100px", textAlign: "center" }}><h3>{error || "Room not found"}</h3></div>;

  const images = JSON.parse(room.images || "[]");

  // Calculate nights dynamically from selected dates
  const calcNights = () => {
    if (!bookingData.checkin || !bookingData.checkout) return 1;
    const start = new Date(bookingData.checkin);
    const end = new Date(bookingData.checkout);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };
  const nights = calcNights();
  const guests = parseInt(bookingData.guests) || 1;
  const totalAmount = room.price * nights * guests;
  const advanceAmount = totalAmount * 0.1;

  return (
    <div className="room-details-page">
      <button onClick={() => navigate("/rooms")} className="back-button" style={{ display: "flex", alignItems: "center", gap: "8px", border: "none", background: "none", cursor: "pointer", color: "var(--primary)", fontWeight: "600", marginBottom: "20px" }}>
        <FaArrowLeft /> Back to Rooms
      </button>

      <div className="details-container" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
        <div className="room-info-section">
          <div className="room-gallery" style={{ marginBottom: "25px" }}>
            <img src={images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} alt={room.name} style={{ width: "100%", height: "450px", objectFit: "cover", borderRadius: "15px" }} />
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <span className="category-tag" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "14px" }}>{room.category}</span>
                <h1 style={{ marginTop: "5px" }}>{room.name}</h1>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)" }}>₹{room.price.toLocaleString()}</div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>per night</div>
              </div>
            </div>

            <p style={{ color: "#64748b", lineHeight: "1.6", marginBottom: "30px" }}>{room.description || "A luxurious stay with world-class amenities and exceptional service."}</p>

            <h3 style={{ marginBottom: "15px" }}>Amenities</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}><FaWifi style={{ color: "var(--info)" }} /> Free Wi-Fi</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}><FaBed style={{ color: "var(--info)" }} /> King Size Bed</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}><FaParking style={{ color: "var(--info)" }} /> Parking Available</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}><FaCoffee style={{ color: "var(--info)" }} /> Breakfast Included</div>
              {room.ac_type === "AC" && <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}><FaSnowflake style={{ color: "var(--info)" }} /> Air Conditioning</div>}
            </div>
          </div>
        </div>

        <div className="booking-sidebar">
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            {bookingStep === 1 ? (
              <>
                <h3 style={{ marginBottom: "20px" }}>Reserve Your Stay</h3>
                <form onSubmit={handleProceedToPayment}>
                  <div className="form-group" style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Check-In Date</label>
                    <input
                      type="date"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      value={bookingData.checkin}
                      onChange={(e) => setBookingData({ ...bookingData, checkin: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Check-Out Date</label>
                    <input
                      type="date"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      value={bookingData.checkout}
                      onChange={(e) => setBookingData({ ...bookingData, checkout: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Guests</label>
                    <select
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>

                  <div style={{ borderTop: "1px dashed #e2e8f0", padding: "15px 0", marginBottom: "15px" }}>
                    {(bookingData.checkin && bookingData.checkout) && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                        ₹{room.price.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""} × {guests} guest{guests !== 1 ? "s" : ""}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", color: "var(--primary)", fontSize: "18px" }}>
                      <span>Total Price</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: "100%", padding: "15px", fontSize: "16px", fontWeight: "600" }}
                  >
                    Proceed to Payment
                  </button>
                </form>
              </>
            ) : (
              <>
                {!paymentSuccess ? (
                  <>
                    <button
                      onClick={() => setBookingStep(1)}
                      style={{ border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: "15px", display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }}
                    >
                      <FaArrowLeft size={10} /> Back to details
                    </button>
                    <h3 style={{ marginBottom: "20px" }}>Choose Payment Plan</h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
                      <div
                        onClick={() => setPaymentMethod("advance")}
                        style={{
                          padding: "15px",
                          borderRadius: "12px",
                          border: `2px solid ${paymentMethod === "advance" ? "var(--primary)" : "#e2e8f0"}`,
                          background: paymentMethod === "advance" ? "#f5f3ff" : "white",
                          cursor: "pointer",
                          transition: "0.2s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "5px" }}>
                          <span>10% Advance</span>
                          <span>₹{advanceAmount.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Remaining payment must be paid at check-in time.
                        </p>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("full")}
                        style={{
                          padding: "15px",
                          borderRadius: "12px",
                          border: `2px solid ${paymentMethod === "full" ? "var(--primary)" : "#e2e8f0"}`,
                          background: paymentMethod === "full" ? "#f5f3ff" : "white",
                          cursor: "pointer",
                          transition: "0.2s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "5px" }}>
                          <span>Full Payment</span>
                          <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Pay once and enjoy your stay without any worries.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleChooseMethod}
                      className="btn-primary"
                      style={{ width: "100%", padding: "15px", fontSize: "16px", fontWeight: "600" }}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? "Connecting..." : "Pay Now"}
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <FaCheckCircle size={50} color="#16a34a" style={{ marginBottom: "20px" }} />
                    <h3 style={{ color: "#16a34a", marginBottom: "10px" }}>Payment Successful!</h3>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Booking Confirmed. Redirecting...</p>
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop: "20px", background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>Instant confirmation for your stay.</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default RoomDetails;
