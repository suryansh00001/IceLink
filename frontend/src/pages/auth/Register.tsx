import React , {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {useAuth} from "../../context/AuthContext";

const Register: React.FC = () => {
    const {register, login} = useAuth();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            await login(email, password);
            navigate("/chats");
        } catch (error) {
            alert("Registration failed: " + (error as Error).message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Register for IceLink</h2>
            <div className="mb-4">

            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
            />
            </div>
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
            Register
            </button>
        </form>
        </div>
    );
}


export default Register;

