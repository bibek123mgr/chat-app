import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import chatSlice from './chatSlice'
import messageSlice from './messageSlice'
import userSlice from './userSlice'
import requestSlice from './requestSlice'
import togglerSlice from './togglerSlice'
import groupSlice from './groupSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice,
        message: messageSlice,
        user: userSlice,
        request: requestSlice,
        toggler: togglerSlice,
        group:groupSlice
    }
})
export default store