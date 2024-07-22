import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../store/authSlice';
import { Link } from 'react-router-dom';
import Users from '../dialogbox/Users';
import RequestList from '../dialogbox/RequestList';

const Navbar = ({ user, login }) => {
    const dispatch = useDispatch();

    const handleLogOut = () => {
        dispatch(logoutUser());
    };

    const [show, setShow] = useState(false);
    const handleToggle = () => {
        setShow((prev) => !prev);
        if (showRequest) {
            setShowRequest(false);
        }
    };

    const [showRequest, setShowRequest] = useState(false);
    const handleToggleRequest = () => {
        setShowRequest((prev) => !prev);
        if (show) {
            setShow(false);
        }
    };

    const handleToggleGroup = () => {

    }

    return (
        <>
            <div className='bg-white min-h-14 shadow-sm flex items-center justify-center'>
                <div className='flex max-w-screen-xl justify-between w-screen px-3'>
                    <div>
                        <Link to={!login ? '/' : '/chat/profile'} className='text-blue-600 font-bold'>Chat App</Link>
                    </div>
                    <div className='flex items-center gap-3'>
                        {login && (
                            <>
                                <button onClick={handleToggle}><i className="fa-solid fa-user-plus"></i></button>
                                <button onClick={handleToggleRequest}><i className="fa-solid fa-user-group"></i></button>
                                <button onClick={handleToggleGroup}><i class="fa-solid fa-people-roof"></i></button>
                            </>
                        )}
                        <div className='flex gap-3 items-center'>
                            {!login ? (
                                <>
                                    <i className="fa-solid fa-user"></i>
                                    <Link to='/login'>Login</Link>
                                    <span className='h-6 w-0.5 bg-blue-500'></span>
                                    <Link to='/register'>Register</Link>
                                </>
                            ) : (
                                <>
                                    <Link to='/chat/profile' className='h-6 w-6 rounded-full bg-gray-400 overflow-hidden'>
                                        <img
                                            src={user?.imageurl}
                                            alt={user?.name}
                                            className='w-full h-full object-cover'
                                        />
                                    </Link>
                                    <button onClick={handleLogOut}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {show && <Users />}
            {showRequest && <RequestList />}
        </>
    );
};

export default Navbar;
