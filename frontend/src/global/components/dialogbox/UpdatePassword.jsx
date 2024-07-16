import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMyPassword } from '../../../store/authSlice';

const UpdatePassword = ({ togglepp }) => {
    const dispatch = useDispatch();
    const formRef = useRef();
    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        password: '',
        newPassword: '',
    });

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        dispatch(updateMyPassword(data));
        togglepp();

    };

    const handleClickOutside = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
            togglepp();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleShowPassword = () => {
        setShow(!show);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
            <form ref={formRef} className="w-full max-w-sm p-4 bg-white shadow-md rounded-md" onSubmit={handleUpdatePassword}>
                <h2 className="text-xl font-bold text-center mb-2">Update Password</h2>
                <div className="flex border rounded-md px-1 mb-2">
                    <input
                        id="oldPassword"
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your old password"
                        value={data.password}
                        name='password'
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 text-sm border-none outline-none focus:outline-none text-black"
                        disabled={false}
                    />
                    <button onClick={handleShowPassword} type="button">
                        {!show ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
                    </button>
                </div>
                <div className="flex border rounded-md px-1 mb-2">
                    <input
                        id="newPassword"
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        value={data.newPassword}
                        name='newPassword'
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 text-sm border-none outline-none focus:outline-none text-black"
                        disabled={false}
                    />
                    <button onClick={handleShowPassword} type="button">
                        {!show ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
                    </button>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        onClick={togglepp}
                        className="inline-block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white"
                        disabled={false}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
                        disabled={false}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePassword;
