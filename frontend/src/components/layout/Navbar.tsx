import { useAuth } from "../../context/AuthContext";
import { updateAvatar } from "../../api/auth.api";
import { useState, useRef } from "react";
import Avatar from "../common/Avatar";
import { showToast } from "../../utils/toast";

const Navbar = () => {
    const { user, setUser, logout } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Please select an image file", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast("File size must be less than 5MB", "error");
            return;
        }

        setUploading(true);
        try {
            const response = await updateAvatar(file);
            if (response.data && response.data.avatarUrl) {
                setUser({ ...user!, avatarUrl: response.data.avatarUrl });
                showToast("Avatar updated successfully", "success");
            }
        } catch (error: any) {
            showToast(error.response?.data?.message || "Failed to upload avatar", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-ice-600 via-ice-500 to-ice-700 text-white p-4 flex items-center justify-between shadow-xl border-b-2 border-ice-400/30">
            <div className="flex items-center gap-3">
                <div className="text-2xl font-bold flex items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-ice-300 blur-xl opacity-60 animate-pulse"></div>
                        <img src="/assets/logo.png" alt="IceLink Logo" className="relative w-12 h-12 object-contain" />
                    </div>
                    <span className="bg-gradient-to-r from-ice-100 to-white bg-clip-text text-transparent">IceLink</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <div className="flex items-center gap-3">
                            <div 
                                className="cursor-pointer hover:opacity-80 transition-opacity relative"
                                onClick={handleAvatarClick}
                                title="Click to update avatar"
                            >
                                <Avatar
                                    src={user.avatarUrl}
                                    name={user.username}
                                    size="md"
                                    showOnline={true}
                                    userId={user._id}
                                />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div>
                                <div className="font-semibold">{user.username}</div>
                                <div className="text-xs opacity-80">{user.email}</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
