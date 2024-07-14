import React from 'react';
import Chats from '../../global/components/chats/Chats';
import Friends from '../../global/components/friends/Friends';

const Chat = () => {
    return (
        <div className='grid grid-cols-12 mx-auto max-w-full'>
            <div className='col-span-3 bg-gray-100 p-4 hidden md:block'>
                <Friends />
            </div>
            <div className='col-span-12 bg-gray-200 p-4 md:col-span-9 '>
                <Chats />
            </div>
        </div>
    );
}

export default Chat