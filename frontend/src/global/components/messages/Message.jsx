import React from 'react';

const Message = ({ message }) => {

    const calculateTimeDifference = (createdAt) => {
        const createdTime = new Date(createdAt);
        const currentTime = new Date();
        const difference = currentTime - createdTime; // difference in milliseconds

        // Convert to seconds, minutes, hours, or days as appropriate
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className='flex items-center mb-4 cursor-pointer bg-gray-100 p-2 rounded-md border-b-2 max-w-screen-sm'>
            <div className='p-3'>
                <div className='flex items-center gap-2'>
                    <div className="w-6 h-6 bg-gray-300 rounded-full">
                        <img src={message?.sender.imageurl} alt="User Avatar" className="w-full h-full rounded-full" />
                    </div>
                    <h2 className="text-lg font-semibold">{message?.sender.name}</h2>
                </div>
                <div className="flex-1">
                    <p className="text-gray-600">{message?.content}</p>
                    <p className='text-right font-thin text-xs'>
                        {calculateTimeDifference(message?.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Message;
