import React, { useState } from 'react';

const Search = ({ onSubmit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(searchTerm);
    };
    return (
        <form onSubmit={handleSubmit} className='flex items-center w-full bg-white px-4 py-2 rounded-lg shadow-md'>
            <input
                type="text"
                placeholder='Search users...'
                value={searchTerm}
                onChange={handleChange}
                className='w-full px-2 py-1 bg-transparent border-none outline-none'
            />
            <button type="submit" className='ml-2'>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </form>
    );
}

export default Search;
