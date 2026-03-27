import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="landing-page">
      {/* Background Hero Section */}
      <div
        className="landing-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        {/* Navbar-like Branding Area */}
        <div className="landing-navbar">
          <div className="landing-brand">
            <span>🏨</span>
            Hotel Booking System
          </div>
        </div>

        {/* Hero Text and Call to Action */}
        <div className="hero-content">
          <h1>Experience Your Dream Stay Redefined</h1>
          <p>
            Welcome to the ultimate destination for luxury, comfort, and convenience.
            Book from our curated selection of premium suites and boutique rooms.
            Your journey to a perfect escape starts here.
          </p>

          <div className="hero-buttons">
            {user ? (
              <button
                className="btn-landing btn-landing-primary"
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  className="btn-landing btn-landing-primary"
                  onClick={() => navigate('/login')}
                >
                  Login to Account
                </button>
                <button
                  className="btn-landing btn-landing-outline"
                  onClick={() => navigate('/register')}
                >
                  Create New Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
