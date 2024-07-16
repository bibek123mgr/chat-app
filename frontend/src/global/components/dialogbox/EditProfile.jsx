import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

const EditProfile = ({ togglepp }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState({
        name: '',
        email: '',
    });
    const formRef = useRef();

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        console.log(data);
        // togglepp();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            togglepp();
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
            <form ref={formRef} className="w-full max-w-sm p-4 bg-white shadow-md rounded-md" onSubmit={handleUpdateProfile}>
                <h2 className="text-xl font-bold text-center mb-2">Update Profile</h2>
                <div className="flex border rounded-md px-1 mb-2">
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your new name"
                        value={data.name}
                        name="name"
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 text-sm border-none outline:none focus:outline-none text-black"
                        disabled={false}
                    />
                </div>
                <div className="flex border rounded-md px-1 mb-2">
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your new email"
                        value={data.email}
                        name="email"
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 text-sm border-none outline:none focus:outline-none text-black"
                        disabled={false}
                    />
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

export default EditProfile;
