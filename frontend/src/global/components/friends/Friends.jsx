import React, { useEffect } from 'react';
import User from '../user/User';
import Search from '../search/Search';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getChats } from '../../../store/chatSlice';
import CreateGroup from '../dialogbox/CreateGroup';
import { toggleCreateGroup } from '../../../store/togglerSlice';

const Friends = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getChats());
    }, [dispatch]);
    const { data: chats } = useSelector((store) => store.chat);
    const { createGroup: show } = useSelector((store) => store.toggler)

    const handleClickCreate = () => {
        dispatch(toggleCreateGroup())
    }
    return (
        <>
            <div>
                <Search />
                <button className='my-2 flex justify-between w-full p-2  bg-blue-800 bg-opacity-70 rounded-md text-white' onClick={handleClickCreate}>Create New Group <span><i className="fa-solid fa-plus"></i></span></button>
                <div className="overflow-y-auto no-scrollbar" style={{ height: 'calc(100vh - 12rem)' }}>
                    {chats && chats.map((chat) =>
                        <Link to={`/chat/${chat?._id}`} key={chat?._id}>
                            <User chat={chat} />
                        </Link>
                    )}
                </div>
            </div>
            {show && <CreateGroup />}
        </>
    );
};

export default Friends;
