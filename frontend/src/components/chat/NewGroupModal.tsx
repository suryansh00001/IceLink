import React, { useState } from 'react';
import { createGroupChat } from '../../api/chat.api';
import { useChats } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';

interface NewGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({ isOpen, onClose }) => {
    const { setChats, selectChat } = useChats();
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [participantIds, setParticipantIds] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateGroup = async () => {
        if (!groupName.trim() || !participantIds.trim()) return;
        
        try {
            setIsCreating(true);
       
            const participantArray = participantIds
                .split(/[,\s]+/)
                .map(id => id.trim())
                .filter(id => id.length > 0);

            if (participantArray.length === 0) {
                alert('Please enter at least one participant ID');
                return;
            }

            const newGroup = await createGroupChat(groupName.trim(), participantArray);
            setChats((prev) => [newGroup, ...prev]);
            selectChat(newGroup);
            setGroupName('');
            setParticipantIds('');
            onClose();
      
            if (!window.location.pathname.includes('/chats')) {
                navigate('/chats');
            }
        } catch (error: any) {
            console.error('Failed to create group:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create group. Please try again.';
            alert(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        if (!isCreating) {
            setGroupName('');
            setParticipantIds('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-ice-950/90 to-ice-900/95 backdrop-blur-md flex items-center justify-center z-50">
            <div className="ice-card p-8 w-96">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-ice-700 to-ice-600 bg-clip-text text-transparent">Create Group Chat</h2>
                
                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-3 ice-input mb-4"
                    disabled={isCreating}
                    autoFocus
                />

                <textarea
                    placeholder="Enter participant IDs (comma or space separated)"
                    value={participantIds}
                    onChange={(e) => setParticipantIds(e.target.value)}
                    className="w-full px-4 py-3 ice-input mb-6 resize-none"
                    rows={3}
                    disabled={isCreating}
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleCreateGroup}
                        disabled={isCreating || !groupName.trim() || !participantIds.trim()}
                        className="flex-1 ice-button py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCreating ? 'Creating...' : 'Create Group'}
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

export default NewGroupModal;
