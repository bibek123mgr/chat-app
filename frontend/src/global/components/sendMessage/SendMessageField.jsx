import React, { useState } from 'react';
import File from '../dialogbox/File';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postMessage } from '../../../store/messageSlice';
import { getSocket } from '../../../Socket';

const SendMessageField = () => {
    const socket = getSocket()
    const dispatch = useDispatch()
    const { id } = useParams()
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [content, setContent] = useState('');

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        const data = {
            content,
            id
        }
        // dispatch(postMessage(id, formData))
        socket.emit('NEW_MESSAGE', data)
        setContent('');
    };

    const onChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div>
            {selectedFiles.length > 0 && <File selectedFiles={selectedFiles} handleRemoveFile={handleRemoveFile} />}
            <div className='flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-md'>
                <form className='flex items-center w-full space-x-2' onSubmit={handleSubmit}>
                    <label htmlFor="file-upload" className='cursor-pointer text-blue-500 px-4 py-2 rounded-md hover:text-blue-600'>
                        <i className="fa-solid fa-file" aria-hidden="true"></i>
                        <span className='sr-only'>Upload file</span>
                    </label>
                    <input id="file-upload" type="file" className='hidden' onChange={handleFileChange} />
                    <div className='flex w-full bg-white px-5 py-3 rounded-md shadow-sm'>
                        <input
                            type="text"
                            placeholder='Type your message...'
                            className='flex-grow border-none outline-none'
                            value={content}
                            onChange={onChange}
                            aria-label="Type your message"
                        />
                        <button
                            type="submit"
                            className='text-blue-500 hover:text-blue-700 ml-4'
                            aria-label="Send message"
                        >
                            <i className="fa-regular fa-paper-plane"></i>
                        </button>
                        <button
                            type="button"
                            className='text-blue-500 hover:text-blue-700 ml-4'
                            aria-label="Start video call"
                        >
                            <i className="fa-solid fa-video"></i>
                        </button>
                        <button
                            type="button"
                            className='text-blue-500 hover:text-blue-700 ml-4'
                            aria-label="Start phone call"
                        >
                            <i className="fa-solid fa-phone"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendMessageField;
