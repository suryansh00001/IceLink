import React from 'react';
import ChatItem from './ChatItem';
import { useChats } from '../../context/ChatContext';

const ChatList = () => {
    const { chats } = useChats();

    return (
        <div className='w-80 bg-gradient-to-b from-white to-ice-50 border-r border-ice-200 flex flex-col h-screen shadow-lg'>
            <div className='p-4 font-bold text-xl border-b border-ice-200 bg-gradient-to-r from-ice-500 to-ice-600 text-white'>
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>Chats</span>
                </div>
            </div>
            <div className='flex-1 overflow-auto'>
                {chats && chats.length > 0 ? (
                    chats.map((chat) => (
                        <ChatItem key={chat._id} chat={chat} />
                    ))
                ) : (
                    <div className="p-8 text-ice-400 text-center">
                        <svg className="w-16 h-16 mx-auto mb-3 text-ice-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                        <div>No chats yet</div>
                        <div className="text-sm mt-1">Start a new conversation!</div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ChatList;