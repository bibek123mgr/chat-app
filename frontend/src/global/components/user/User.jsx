import React, { useRef } from 'react';
import { postRequest } from '../../../store/requestSlice';
import { useDispatch } from 'react-redux';

const User = ({ chat, add }) => {
    const divRef = useRef();
    const dispatch = useDispatch();

    const handleSendRequest = () => {
        dispatch(postRequest(chat._id));
    };



    return (
        <div className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md border-b-2" ref={divRef}>
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img src={chat?.imageurl} alt="User Avatar" className="w-12 h-12 rounded-full" />
            </div>
            <div className="flex-1 sm:block hidden">
                <h2 className="text-lg font-semibold">{chat?.name}</h2>
            </div>
            {add && <button onClick={handleSendRequest}><i className="fa-solid fa-plus"></i></button>}
        </div>
    );
};


export default User;
