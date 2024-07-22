import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreateGroup } from '../../../store/togglerSlice';
import { fetchMyfriends } from '../../../store/userSlice';
import { createMyGroup } from '../../../store/groupSlice';

const AddFriends = ({ name, onRemove }) => {
    return (
        <div className='w-auto flex gap-2 p-2 border rounded'>
            <h1>{name}</h1>
            <button type="button" onClick={() => onRemove(name)}>X</button>
        </div>
    );
}

const User = ({ user, onAdd }) => {
    return (
        <div className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md border-b-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img src={user.imageurl} alt="User Avatar" className="w-12 h-12 rounded-full" />
            </div>
            <div className="flex-1 sm:block hidden">
                <h2 className="text-lg font-semibold">{user.name}</h2>
            </div>
            <button type="button" onClick={() => onAdd(user)}><i className="fa-solid fa-plus"></i></button>
        </div>
    );
};

const CreateGroup = () => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState('');

    const handleAddMember = (user) => {
        if (user && !members.some(member => member._id === user._id)) {
            setMembers([...members, user]);
        }
    }

    useEffect(() => {
        dispatch(fetchMyfriends());
    }, [dispatch]);

    const handleToggler = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
            dispatch(toggleCreateGroup());
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleToggler);
        return () => {
            document.removeEventListener('mousedown', handleToggler);
        }
    }, []);

    const handleRemoveMember = (idToRemove) => {
        setMembers(members.filter(member => member._id !== idToRemove));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const memberIds = members.map(member => member._id);
        const groupData = {
            name: groupName,
            members: memberIds
        };
        dispatch(createMyGroup(groupData));
    }

    const { friends } = useSelector((store) => store.user);

    return (
        <div className='flex justify-center items-center fixed inset-0 bg-slate-800 bg-opacity-50 z-20'>
            <form ref={formRef} className='w-96 bg-white shadow-md rounded-md p-4 flex flex-col gap-2' onSubmit={handleSubmit}>
                <h1>Create Group</h1>
                <input
                    type="text"
                    name='groupName'
                    value={groupName}
                    placeholder="Enter group name"
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                    className='p-2 border rounded-md'
                />
                <div className='min-h-[50px] flex flex-wrap items-center max-w-full gap-2'>
                    {members.length > 0 ? (
                        members.map((member) => (
                            <AddFriends
                                key={member._id}
                                name={member.name}
                                onRemove={() => handleRemoveMember(member._id)}
                            />
                        ))
                    ) : (
                        <div className='text-center text-gray-500 w-full'>No members added yet</div>
                    )}
                </div>
                <button type="submit" className='w-full p-2 bg-green-500 text-white rounded-md'>Create Group</button>
                <div className='max-h-[50vh] overflow-y-auto no-scrollbar'>
                    {friends && friends.map((friend) => (
                        <User user={friend} key={friend._id} onAdd={handleAddMember} />
                    ))}
                </div>
            </form>
        </div>
    );
}

export default CreateGroup;
