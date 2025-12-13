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
            // Extract validation errors from the response
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.msg).join('\n');
                alert(errorMessages);
            } else {
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
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ice-900 via-ice-800 to-ice-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-ice-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ice-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-ice-400 to-ice-500 blur-2xl opacity-50 animate-pulse"></div>
                            <img src="/assets/logo.png" alt="IceLink Logo" className="relative w-24 h-24 object-contain" />
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-ice-200 via-white to-ice-300 bg-clip-text text-transparent">
                            IceLink
                        </span>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-ice-900/50 backdrop-blur-xl border border-ice-700/30 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-ice-100 to-ice-200 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                        <p className="text-ice-300">Sign in to continue your conversations</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-ice-200 font-medium mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-ice-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email" 
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-white placeholder-ice-400 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/50 focus:outline-none transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-ice-200 font-medium mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-white placeholder-ice-400 focus:border-ice-500 focus:ring-2 focus:ring-ice-500/50 focus:outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-ice-400 to-ice-500 hover:from-ice-500 hover:to-ice-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-ice-500/50 transition-all duration-300 hover:scale-105"
                    >
                        Sign In
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-ice-300">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-ice-400 hover:text-ice-300 font-semibold transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}   

export default Login;