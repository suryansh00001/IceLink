import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {useAuth} from "../../context/AuthContext";


const Login: React.FC = () => {
    const {login} = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/chats");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message;

            if (errorMessage.toLowerCase().includes("user not found") || 
                errorMessage.toLowerCase().includes("invalid credentials") ||
                error?.response?.status === 404) {
                if (window.confirm("User not found. Would you like to register?")) {
                    navigate("/register");
                }
            } else {
                alert("Login failed: " + errorMessage);
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login to IceLink</h2>
            <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
            />
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input type="password"
                     id="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
            />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition duration-200">
            Login
            </button>
        </form>
        </div>
    );
}   

export default Login;