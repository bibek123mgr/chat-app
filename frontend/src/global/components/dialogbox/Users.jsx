import React, { useEffect, useState } from 'react';
import Search from '../search/Search';
import User from '../user/User';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../store/userSlice';

const Users = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((store) => store.user);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchUsers(searchTerm));
    }, [dispatch]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const handleSearchSubmit = (term) => {
        setSearchTerm(term);
        dispatch(fetchUsers(term));
    };
    const add = true;
    return (
        <div className='w-96 fixed bg-white left-1/2 transform -translate-x-1/2 p-4 mt-11 shadow-md rounded-lg h-auto z-50'>
            <Search onChange={handleSearchChange} onSubmit={handleSearchSubmit} />
            <div className='mt-4 overflow-y-auto max-h-[calc(100vh-30vh)] no-scrollbar'>
                {users && users.map((user) => (
                    <User key={user._id} chat={user} add={add} />
                ))}
            </div>
        </div>
    );
};

export default Users;
