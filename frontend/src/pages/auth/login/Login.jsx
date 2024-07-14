import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, reSetStatus } from '../../../store/authSlice';
import { STATUSES } from '../../../global/http/Type';

const inputFields = [
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

const Login = () => {
    const dispatch = useDispatch();
    const { status } = useSelector((store) => store.auth)
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginUser(data))
    };

    useEffect(() => {
        if (status === STATUSES.SUCCESS) {
            navigate('/chat');
            dispatch(reSetStatus())
        }
    }, [status]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    return (
        <div className="flex items-center justify-center max-h-screen py-20 px-2">
            <form className="bg-white py-11 px-5 rounded-lg shadow-lg w-[450px]" onSubmit={handleLogin}>
                <h2 className="text-4xl mb-5 font-semibold">Login</h2>
                {inputFields.map(item => (
                    <div key={item.name} className="mb-2">
                        <label htmlFor={item.name} className="block text-gray-700 mb-1 capitalize">
                            {item.name}
                        </label>
                        <input
                            type={item.type}
                            name={item.name}
                            id={item.name}
                            onChange={onChange}
                            value={data[item.name]}
                            placeholder={item.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                ))}
                <div className="text-right">
                    <Link to="/forgot-password" className="text-blue-500 hover:underline">
                        Forget password?
                    </Link>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2"
                >
                    Login
                </button>
                <div className="text-center mt-2">
                    Don't have an account?
                    <Link to="/register" className="text-blue-500 underline">
                        Click here.
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
