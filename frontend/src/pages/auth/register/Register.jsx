import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../store/authSlice';

const Register = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        dispatch(registerUser(formData))

    };

    const onChange = (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }

    const inputFields = [
        {
            name: "name",
            type: "text",
            placeholder: "Enter your name"
        },
        {
            name: "email",
            type: "email",
            placeholder: "Enter your email"
        },
        {
            name: "password",
            type: "password",
            placeholder: "Enter your password"
        }
    ];
    return (
        <div className="flex items-center justify-center max-h-screen py-20 px-2">
            <form className="bg-white py-11 px-5 rounded-lg shadow-lg w-[450px]" onSubmit={handleRegister}>
                <h2 className="text-4xl mb-5 font-semibold">Register Now</h2>
                {inputFields.map(item => (
                    <div key={item.name} className="mb-2">
                        <label htmlFor={item.name} className="block text-gray-700 mb-1 capitalize">
                            {item.name}
                        </label>
                        <input
                            type={item.type}
                            name={item.name}
                            id={item.name}
                            value={data[item.name]}
                            onChange={onChange}
                            placeholder={item.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
                >
                    Register Now
                </button>
                <div className="text-center mt-2">
                    Already have an account?
                    <Link to="/" className="text-blue-500 underline">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
