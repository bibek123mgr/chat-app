import React from 'react';

const ChatSide = () => {
    const handleRemoveMember = () => {
        console.log('removing members');
    };

    const addMember = () => {
        console.log('adding members');
    };

    const exitGroup = () => {
        console.log('exiting group');
    };

    const members = [];
    for (let i = 0; i < 10; i++) {
        members.push(
            <div className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-3 rounded-md border-b-2" key={i}>
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img src='' alt="User Avatar" className="w-12 h-12 rounded-full" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">name name</h2>
                </div>
                <button onClick={handleRemoveMember}>
                    <i className="fa-solid fa-user-minus text-red-600"></i>
                </button>
            </div>
        );
    }

    return (
        <div className='md:w-96 w-64 h-auto z-10 p-2 bg-gray-300'>
            <button onClick={addMember} className="flex items-center mb-2 cursor-pointer p-2 rounded-md gap-2 text-center w-full justify-center hover:text-white">
                <span>Add Members</span>
                <i className="fa-solid fa-user-plus text-blue-600"></i>
            </button>
            <div className='max-h-[calc(100vh-30vh)] no-scrollbar overflow-y-auto'>
                {members}
            </div>
            <div className='flex items-center mb-2 cursor-pointer p-3 w-full justify-end hover:text-white'>
                <button onClick={exitGroup}>
                    <span className='mr-2'>Exit Group</span>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatSide;
