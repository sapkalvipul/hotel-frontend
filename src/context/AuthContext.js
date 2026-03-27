import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await API.post("/auth/login", { email, password });
            const { token, user } = res.data;

            const standardizedUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone_number: user.phone_number,
                profile_photo: user.profile_photo
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(standardizedUser));

            setToken(token);
            setUser(standardizedUser);
            return { success: true, role: user.role };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            const res = await API.put("/user/update-profile", data);
            const updatedUser = res.data.user;

            const standardizedUser = {
                ...user,
                name: updatedUser.username || updatedUser.name,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                profile_photo: updatedUser.profile_photo || user.profile_photo
            };

            localStorage.setItem("user", JSON.stringify(standardizedUser));
            setUser(standardizedUser);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Update failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
