import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NewChatModal from '../chat/NewChatModal';
import NewGroupModal from '../chat/NewGroupModal';

const SideBar = () => {
    const navigate = useNavigate();
    const {user, logout } = useAuth();
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);

    return (
        <>
            <div className='w-20 h-screen bg-primary text-white flex flex-col items-center py-4'>
                <div className='w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold mb-6'>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <button 
                    onClick={() => setShowNewChatModal(true)} 
                    className='w-12 h-12 rounded-lg bg-white text-primary hover:bg-gray-100 transition duration-200 mb-4 flex items-center justify-center text-2xl font-bold'
                    title="New Chat"
                >
                    +
                </button>
                
                <button 
                    onClick={() => setShowNewGroupModal(true)} 
                    className='w-12 h-12 rounded-lg bg-white text-primary hover:bg-gray-100 transition duration-200 mb-4 flex items-center justify-center text-xl'
                    title="New Group"
                >
                    👥+
                </button>
                
                <button onClick={() => navigate('/chats')} className='w-12 h-12 rounded-lg hover:bg-white hover:text-primary transition duration-200 mb-4 flex items-center justify-center'>
                    💬
                </button>
                <button onClick={() => navigate('/contacts')} className='w-12 h-12 rounded-lg hover:bg-white hover:text-primary transition duration-200 mb-4 flex items-center justify-center'>
                    👥
                </button>
                <div className='flex-1'></div>
                <button className='w-12 h-12 rounded-lg hover:bg-white hover:text-primary transition duration-200 mb-4 flex items-center justify-center'>
                    ⚙️
                </button>
                <button onClick={async () => {
                    await logout();
                    navigate('/login');
                }} className='w-12 h-12 rounded-lg bg-red-500 hover:bg-red-600 transition duration-200 flex items-center justify-center'>
                    Logout
                </button>
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
