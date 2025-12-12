import React from 'react';
import ChatItem from './ChatItem';
import { useChats } from '../../context/ChatContext';

const ChatList = () => {
    const { chats } = useChats();

    return (
        <div className='w-80 bg-white border-r border-gray-300 flex flex-col h-screen'>
            <div className='p-4 font-bold text-xl border-b border-gray-300'>
                Chats
            </div>
            <div className='flex-1 overflow-auto'>
                {chats && chats.length > 0 ? (
                    chats.map((chat) => (
                        <ChatItem key={chat._id} chat={chat} />
                    ))
                ) : (
                    <div className="p-4 text-gray-500 text-center">
                        No chats yet
                    </div>
                )}
            </div>
        </div>
    );
}
export default ChatList;