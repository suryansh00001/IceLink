import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateDetails, changePassword } from "../../api/auth.api";
import toast from "react-hot-toast";

export default function Settings() {
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isLoading, setIsLoading] = useState(false);
    
    // Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleUpdateDetails = async () => {
        if (!username && !email) {
            toast.error("Nothing to update");
            return;
        }

        setIsLoading(true);
        try {
            const response = await updateDetails(username, email);
            setUser(response.data.user);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            // Extract validation errors from the response
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.msg).join('\n');
                toast.error(errorMessages);
            } else {
                toast.error(error.response?.data?.message || "Failed to update profile");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setIsEditing(false);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password changed successfully! Please login again.");
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            // Extract validation errors from the response
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.msg).join('\n');
                toast.error(errorMessages);
            } else {
                toast.error(error.response?.data?.message || "Failed to change password");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-ice-900 via-ice-800 to-ice-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                      
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-ice-100 via-ice-200 to-ice-300 bg-clip-text text-transparent mb-2">
                                Settings
                            </h1>
                            <p className="text-ice-400">Manage your account and preferences</p>
                        </div>

                       
                        <div className="bg-ice-900/50 backdrop-blur-xl border border-ice-700/30 rounded-2xl shadow-2xl overflow-hidden">
                           
                            <div className="flex border-b border-ice-700/30">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "profile"
                                            ? "text-ice-300 border-b-2 border-ice-400 bg-ice-800/50"
                                            : "text-ice-500 hover:text-ice-300"
                                    }`}
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab("account")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "account"
                                            ? "text-ice-300 border-b-2 border-ice-400 bg-ice-800/50"
                                            : "text-ice-500 hover:text-ice-300"
                                    }`}
                                >
                                    Account
                                </button>
                                <button
                                    onClick={() => setActiveTab("privacy")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "privacy"
                                            ? "text-ice-300 border-b-2 border-ice-400 bg-ice-800/50"
                                            : "text-ice-500 hover:text-ice-300"
                                    }`}
                                >
                                    Privacy
                                </button>
                            </div>

                            
                            <div className="p-6">
                                {activeTab === "profile" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 bg-ice-600 hover:bg-ice-700 text-white rounded-lg font-medium transition-colors"
                                                >
                                                    Edit Profile
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleCancel}
                                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleUpdateDetails}
                                                        disabled={isLoading}
                                                        className="px-4 py-2 bg-ice-600 hover:bg-ice-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {isLoading ? "Saving..." : "Save Changes"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-ice-300 mb-2">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-ice-200 focus:outline-none focus:border-ice-500 disabled:opacity-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-ice-300 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-ice-200 focus:outline-none focus:border-ice-500 disabled:opacity-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-ice-300 mb-2">
                                                User ID
                                            </label>
                                            <input
                                                type="text"
                                                value={user?._id || ""}
                                                disabled
                                                className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-ice-200 focus:outline-none focus:border-ice-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "account" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
                                        
                                        {/* Change Password Section */}
                                        <div className="bg-ice-950/30 border border-ice-700/30 rounded-lg p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-ice-300 mb-2">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-ice-200 focus:outline-none focus:border-ice-500"
                                                        placeholder="Enter current password"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-ice-300 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-ice-200 focus:outline-none focus:border-ice-500"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-ice-300 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full px-4 py-3 bg-ice-950/50 border border-ice-700/50 rounded-lg text-ice-200 focus:outline-none focus:border-ice-500"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                                
                                                <button
                                                    onClick={handleChangePassword}
                                                    disabled={isChangingPassword}
                                                    className="px-6 py-3 bg-ice-600 hover:bg-ice-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                                >
                                                    {isChangingPassword ? "Changing..." : "Change Password"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-ice-950/30 border border-ice-700/30 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-white mb-2">Danger Zone</h3>
                                            <p className="text-ice-400 mb-4">Once you logout, you'll need to sign in again.</p>
                                            <button
                                                onClick={logout}
                                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "privacy" && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-4">Privacy & Security</h2>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-ice-950/30 border border-ice-700/30 rounded-lg">
                                                <div>
                                                    <h3 className="text-white font-medium">Show Online Status</h3>
                                                    <p className="text-sm text-ice-400">Let others see when you're online</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-ice-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ice-500"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-ice-950/30 border border-ice-700/30 rounded-lg">
                                                <div>
                                                    <h3 className="text-white font-medium">Read Receipts</h3>
                                                    <p className="text-sm text-ice-400">Show when you've read messages</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-ice-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ice-500"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
