import React, { useEffect, useState } from 'react';
import Header from './Header';
import SendMessageField from '../sendMessage/SendMessageField';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessage } from '../../../store/messageSlice';
import Message from '../messages/Message';
import { getSocket } from '../../../Socket';

const Chats = () => {
    const socket = getSocket();
    const { id } = useParams();
    const { data: messages } = useSelector((store) => store.message);
    const [messagesAdd, setMessagesAdd] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchMessage(id));
    }, [id, dispatch]);

    const { data: user } = useSelector((store) => store.auth);

    useEffect(() => {
        const handleNewMessage = (data) => {
            setMessagesAdd(prevMessages => [...prevMessages, data]);
        };

        socket.on('NEW_MESSAGE', handleNewMessage);
        return () => {
            socket.off('NEW_MESSAGE', handleNewMessage);
        };
    }, [socket]);
    useEffect(() => {
        if (messages) {
            setMessagesAdd(messages);
        }
    }, [messages]);

    return (
        <div>
            <Header />
            <div className='overflow-y-auto h-screen p-2 mb-9 pb-20 no-scrollbar' style={{ height: 'calc(100vh - 16.5rem)' }}>
                {
                    messagesAdd.length > 0 ? messagesAdd.map((message) => (
                        <div className={`flex my-2 ${user?._id == message?.sender?._id ? 'justify-end' : 'justify-start'}`} key={message?._id}>
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
