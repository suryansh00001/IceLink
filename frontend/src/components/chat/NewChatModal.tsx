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
        <div className="fixed inset-0 bg-gradient-to-br from-ice-950/90 to-ice-900/95 backdrop-blur-md flex items-center justify-center z-50">
            <div className="ice-card p-8 w-96">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-ice-700 to-ice-600 bg-clip-text text-transparent">Start New Chat</h2>
                <input
                    type="text"
                    placeholder="Enter user ID"
                    value={newChatUserId}
                    onChange={(e) => setNewChatUserId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
                    className="w-full px-4 py-3 ice-input mb-6"
                    disabled={isCreating}
                    autoFocus
                />
                <div className="flex gap-3">
                    <button
                        onClick={handleCreateChat}
                        disabled={isCreating || !newChatUserId.trim()}
                        className="flex-1 ice-button py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCreating ? 'Creating...' : 'Create Chat'}
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={isCreating}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
