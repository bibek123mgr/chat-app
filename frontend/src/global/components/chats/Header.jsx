import React, { useState } from 'react'
import ChatSide from '../dialogbox/ChatSide'

const Header = () => {

    const [state, setState] = useState(false);
    const changeState = () => {
        setState(!state);
    }
    return (
        <>
            <div className='flex w-full justify-between p-4 bg-white shadow-md'>
                <div className='flex gap-3'>
                    <div className='h-6 w-6 rounded-full bg-gray-400 overflow-hidden'>
                        <img
                            src=''
                            alt=''
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <h1>Bibek kumar Bakabal</h1>
                </div>
                <button onClick={changeState}><i className="fa-solid fa-bars"></i></button>
            </div>
            {state && <div className='fixed right-4 z-50' >
                <ChatSide />
            </div>}
        </>
    )
}

export default Header
