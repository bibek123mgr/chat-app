// import { createContext, useContext, useMemo } from 'react'
// import { io } from 'socket.io-client'

// // const socket = io("http://localhost:3000", {
// //     withCredentials: true,
// //     auth:{token:localStorage.getItem('token')}
// // })

// const SocketContext = createContext()
// const SocketProvider = ({ Children }) => {
//     const socket = useMemo(() => {
//         io("http://localhost:3000", {
//             withCredentials: true
//         })
//     }, [])
//     return (
//         <SocketContext.Provider value={socket}>
//             {Children}
//         </SocketContext.Provider>
//     )
// }
// const getSocket = useContext(SocketProvider)
// export { getSocket, SocketProvider }

import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io('http://localhost:3000', { withCredentials: true }), []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export { SocketProvider, getSocket };