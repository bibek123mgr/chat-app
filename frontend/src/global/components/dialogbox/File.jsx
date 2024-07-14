import React from 'react'

const File = ({ selectedFiles, handleRemoveFile }) => {
    return (
        <div className='fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-md shadow-md w-fit max-w-screen-sm mb-1'>
            <ul className='space-y-2'>
                {selectedFiles.map((file, index) => (
                    <li key={index} className='flex justify-between items-center'>
                        <span className='truncate max-w-xs'>{file.name}</span>
                        <button
                            className='text-red-500 hover:text-red-700 ml-2'
                            onClick={() => handleRemoveFile(index)}
                            aria-label={`Remove ${file.name}`}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default File
