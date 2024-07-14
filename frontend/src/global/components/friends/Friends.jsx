import React, { useEffect } from 'react';
import User from '../user/User';
import Search from '../search/Search';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getChats } from '../../../store/chatSlice';

const Friends = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getChats());
    }, [dispatch]);
    const { data: chats } = useSelector((store) => store.chat);
    return (
        <div>
            <Search />
            <div className="overflow-y-auto no-scrollbar" style={{ height: 'calc(100vh - 12rem)' }}>
                {chats && chats.map((chat) =>
                    <Link to={`/chat/${chat?._id}`} key={chat?._id}>
                        <User chat={chat} />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Friends;
