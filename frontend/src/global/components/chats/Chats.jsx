import React, { useEffect } from 'react';
import Header from './Header';
import SendMessageField from '../sendMessage/SendMessageField';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessage } from '../../../store/messageSlice';
import Message from '../messages/Message';


const Chats = () => {
    const { id } = useParams()
    const { data: messages } = useSelector((store) => store.message)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchMessage(id))
    }, [id, dispatch])
    const { data: user } = useSelector((store) => store.auth)

    return (
        <div>
            <Header />
            <div className='overflow-y-auto h-screen p-2 mb-9 pb-20 no-scrollbar' style={{ height: 'calc(100vh - 16.5rem)' }}>
                {
                    messages.length > 0 ? messages.map((message) => (
                        <div className={`flex my-2 ${user._id !== message.sender ? 'justify-end' : 'justify-start'}`} key={message?._id}>
                            <Message message={message} />
                        </div>
                    )) :
                        <div>no messages</div>
                }

            </div>
            <SendMessageField />
        </div>
    );
};

export default Chats;
