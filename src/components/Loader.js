import React from "react";

const Loader = ({ fullPage = false }) => {
    const loaderStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: fullPage ? "100vh" : "200px",
        width: "100%",
    };

    const spinnerStyle = {
        width: "50px",
        height: "50px",
        border: "5px solid #f3f3f3",
        borderTop: "5px solid var(--primary)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    };

    return (
        <div style={loaderStyle}>
            <div style={spinnerStyle}></div>
            <p style={{ marginTop: "15px", color: "var(--text-muted)", fontWeight: "500" }}>Please wait...</p>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Loader;
