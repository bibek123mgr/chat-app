import React from 'react'
import { Outlet } from 'react-router-dom'
import Friends from '../components/friends/Friends'
import { getSocket } from '../../Socket'

const ChatLayout = () => {
    const socket = getSocket()
    return (
        <div className='grid grid-cols-12 mx-auto max-w-full h-[calc(100vh-8vh)]'>
            <div className='col-span-3 bg-gray-100 p-4 hidden md:block'>
                <Friends />
            </div>
            <div className='col-span-12 bg-gray-200 p-4 md:col-span-9 '>
                <Outlet />
            </div>
        </div>
    )
}

export default ChatLayout
