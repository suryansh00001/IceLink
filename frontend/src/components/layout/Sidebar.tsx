import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NewChatModal from '../chat/NewChatModal';
import NewGroupModal from '../chat/NewGroupModal';
import Avatar from '../common/Avatar';

const SideBar = () => {
    const navigate = useNavigate();
    const {user, logout } = useAuth();
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);

    return (
        <>
            <div className='w-20 h-screen bg-gradient-to-b from-ice-800 to-ice-900 text-white flex flex-col items-center py-4 border-r border-ice-700/50 shadow-2xl'>
                {user && (
                    <div className='mb-6'>
                        <Avatar
                            src={user.avatarUrl}
                            name={user.username}
                            size="lg"
                            showOnline={true}
                            userId={user._id}
                        />
                    </div>
                )}
                <button 
                    onClick={() => setShowNewChatModal(true)} 
                    className='w-12 h-12 rounded-lg bg-ice-500 text-white hover:bg-ice-400 transition-all duration-300 mb-4 flex items-center justify-center text-2xl font-bold shadow-lg hover:shadow-ice-400/50 hover:scale-110'
                    title="New Chat"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                </button>
                
                <button 
                    onClick={() => setShowNewGroupModal(true)} 
                    className='w-12 h-12 rounded-lg bg-ice-600 text-white hover:bg-ice-500 transition-all duration-300 mb-4 flex items-center justify-center text-xl shadow-lg hover:shadow-ice-500/50 hover:scale-110'
                    title="New Group"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                </button>
                
                <button onClick={() => navigate('/chats')} className='w-12 h-12 rounded-lg hover:bg-ice-700 transition-all duration-300 mb-4 flex items-center justify-center text-2xl hover:scale-110'>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                </button>
                <button onClick={() => navigate('/call-history')} className='w-12 h-12 rounded-lg hover:bg-ice-700 transition-all duration-300 mb-4 flex items-center justify-center text-2xl hover:scale-110' title="Call History">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                    </svg>
                </button>
                <button 
                    onClick={() => navigate('/settings')} 
                    className='w-12 h-12 rounded-lg hover:bg-ice-700 transition-all duration-300 mb-4 flex items-center justify-center hover:scale-110'
                    title="Settings"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                </button>
                <div className='flex-1'></div>
            </div>

            <NewChatModal 
                isOpen={showNewChatModal} 
                onClose={() => setShowNewChatModal(false)} 
            />

            <NewGroupModal 
                isOpen={showNewGroupModal} 
                onClose={() => setShowNewGroupModal(false)} 
            />
        </>
    );
}


export default SideBar;
