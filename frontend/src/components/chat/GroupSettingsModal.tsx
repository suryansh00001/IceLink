import React, { useState } from 'react';
import { addUserToGroupChat, removeUserFromGroupChat, renameGroupChat } from '../../api/chat.api';
import { Ichat } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';
import { useChats } from '../../context/ChatContext';

interface GroupSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    chat: Ichat | null;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({ isOpen, onClose, chat }) => {
    const { user } = useAuth();
    const { setChats } = useChats();
    const [newMemberId, setNewMemberId] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState<'members' | 'rename'>('members');

    if (!isOpen || !chat || !chat.isGroupChat) return null;

    const handleAddMember = async () => {
        if (!newMemberId.trim() || !chat) return;
        
        try {
            setIsProcessing(true);
            const updatedChat = await addUserToGroupChat(chat._id, newMemberId.trim());
            
            setChats((prev) => 
                prev.map((c) => (c._id === chat._id ? updatedChat : c))
            );
            
            setNewMemberId('');
            alert('Member added successfully!');
        } catch (error: any) {
            console.error('Failed to add member:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add member.';
            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!chat) return;
        
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        
        try {
            setIsProcessing(true);
            const updatedChat = await removeUserFromGroupChat(chat._id, userId);
            
            setChats((prev) => 
                prev.map((c) => (c._id === chat._id ? updatedChat : c))
            );
            
            alert('Member removed successfully!');
        } catch (error: any) {
            console.error('Failed to remove member:', error);
            const errorMessage = error.response?.data?.message || 'Failed to remove member.';
            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRenameGroup = async () => {
        if (!newGroupName.trim() || !chat) return;
        
        try {
            setIsProcessing(true);
            const updatedChat = await renameGroupChat(chat._id, newGroupName.trim());

            setChats((prev) => 
                prev.map((c) => (c._id === chat._id ? updatedChat : c))
            );
            
            setNewGroupName('');
            alert('Group renamed successfully!');
        } catch (error: any) {
            console.error('Failed to rename group:', error);
            const errorMessage = error.response?.data?.message || 'Failed to rename group.';
            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Group Settings</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="flex gap-2 mb-4 border-b">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-4 py-2 font-medium transition ${
                            activeTab === 'members'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab('rename')}
                        className={`px-4 py-2 font-medium transition ${
                            activeTab === 'rename'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Rename
                    </button>
                </div>

                {activeTab === 'members' && (
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                            Group Members ({chat.participants.length})
                        </h3>
                        
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                            {chat.participants.map((participant: any) => (
                                <div 
                                    key={participant._id} 
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                                            {participant.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-800">
                                            {participant.username}
                                            {participant._id === user?._id && ' (You)'}
                                        </span>
                                    </div>
                                    
                                    {participant._id !== user?._id && (
                                        <button
                                            onClick={() => handleRemoveMember(participant._id)}
                                            disabled={isProcessing}
                                            className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-700 mb-2">Add Member</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter user ID"
                                    value={newMemberId}
                                    onChange={(e) => setNewMemberId(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    disabled={isProcessing}
                                />
                                <button
                                    onClick={handleAddMember}
                                    disabled={isProcessing || !newMemberId.trim()}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

   
                {activeTab === 'rename' && (
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                            Current Name: {chat.groupChatName}
                        </h3>
                        
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Enter new group name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleRenameGroup()}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                disabled={isProcessing}
                            />
                            <button
                                onClick={handleRenameGroup}
                                disabled={isProcessing || !newGroupName.trim()}
                                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Renaming...' : 'Rename Group'}
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition disabled:cursor-not-allowed"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default GroupSettingsModal;
