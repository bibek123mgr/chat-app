import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMe } from '../../../store/authSlice';
import { STATUSES } from '../../http/Type';

const DeleteMe = ({ toggle }) => {
    const { status } = useSelector((store) => store.auth)
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const formRef = useRef();

    const handleShowPassword = () => {
        setShow(!show);
    };

    const handleDeleteMe = (e) => {
        e.preventDefault();
        dispatch(deleteMe(password));
    };

    const handleClickOutside = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
            toggle();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
            <form ref={formRef} className="w-full max-w-sm p-4 bg-white shadow-md rounded-md" onSubmit={handleDeleteMe}>
                <h2 className="text-xl font-bold text-center mb-2">Delete Account</h2>
                <div className="flex border rounded-md px-1 mb-2">
                    <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        name='password'
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 text-sm border-none outline:none focus:outline-none text-black"
                    />
                    <button onClick={handleShowPassword} type='button'>
                        {!show ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
                    </button>
                </div>
                <div className="flex justify-center space-x-4">
                    <button onClick={toggle} className="inline-block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
                    >
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeleteMe;
