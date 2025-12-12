import React, { useState } from 'react';
import { createChat } from '../../api/chat.api';
import { useChats } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
    const { setChats, selectChat } = useChats();
    const navigate = useNavigate();
    const [newChatUserId, setNewChatUserId] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateChat = async () => {
        if (!newChatUserId.trim()) return;
        
        try {
            setIsCreating(true);
            const newChat = await createChat(newChatUserId.trim());
            setChats((prev) => [newChat, ...prev]);
            selectChat(newChat);
            setNewChatUserId('');
            onClose();
            // Navigate to chats page if not already there
            if (!window.location.pathname.includes('/chats')) {
                navigate('/chats');
            }
        } catch (error: any) {
            console.error('Failed to create chat:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create chat. Please check the user ID and try again.';
            alert(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        if (!isCreating) {
            setNewChatUserId('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Start New Chat</h2>
                <input
                    type="text"
                    placeholder="Enter user ID"
                    value={newChatUserId}
                    onChange={(e) => setNewChatUserId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-4"
                    disabled={isCreating}
                    autoFocus
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateChat}
                        disabled={isCreating || !newChatUserId.trim()}
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isCreating ? 'Creating...' : 'Create Chat'}
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={isCreating}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
