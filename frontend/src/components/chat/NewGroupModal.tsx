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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Create Group Chat</h2>
                
                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-3"
                    disabled={isCreating}
                    autoFocus
                />

                <textarea
                    placeholder="Enter participant IDs (comma or space separated)"
                    value={participantIds}
                    onChange={(e) => setParticipantIds(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-4 resize-none"
                    rows={3}
                    disabled={isCreating}
                />

                <div className="flex gap-2">
                    <button
                        onClick={handleCreateGroup}
                        disabled={isCreating || !groupName.trim() || !participantIds.trim()}
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isCreating ? 'Creating...' : 'Create Group'}
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

export default NewGroupModal;
