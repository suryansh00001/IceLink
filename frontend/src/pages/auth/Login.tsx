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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ice-100 via-ice-50 to-white">
        <form onSubmit={handleSubmit} className="ice-card p-10 w-full max-w-md">
            <div className="text-center mb-8">
                <svg className="w-20 h-20 mx-auto mb-4 text-ice-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.68l7 3.5v6.64l-7-3.5V9.68zm16 0v6.64l-7 3.5v-6.64l7-3.5z"/>
                </svg>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-ice-600 to-ice-800 bg-clip-text text-transparent">Welcome to IceLink</h2>
                <p className="text-ice-600 text-sm mt-2">Sign in to continue</p>
            </div>
            <div className="mb-5">
            <label className="block text-ice-700 font-medium mb-2" htmlFor="email">Email</label>
            <input
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 ice-input"
                placeholder="your@email.com"
                required
            />
            </div>
            <div className="mb-6">
            <label className="block text-ice-700 font-medium mb-2" htmlFor="password">Password</label>
            <input type="password"
                     id="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 ice-input"
                        placeholder="••••••••"
                        required
            />
            </div>
            <button type="submit" className="w-full ice-button py-3 text-lg font-semibold">
            Sign In
            </button>
        </form>
        </div>
    );
}   

export default Login;