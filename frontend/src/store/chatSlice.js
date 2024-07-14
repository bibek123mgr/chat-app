import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import { API } from "../global/http";

const initialState = {
    data:[],
    Status:STATUSES.IDLE
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChats(state, action) {
            state.data = action.payload
        },
        setStatus(state, action) {
            state.Status=action.payload
        },
    }
})

export const { setChats, setStatus } = chatSlice.actions
export default chatSlice.reducer


export function getChats() {
    return async function getChatsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
        const response=await API.get(`api/v1/chats`)
        dispatch(setChats(response.data.data))
        dispatch(setStatus(STATUSES.SUCCESS))
        } catch (error) {
        dispatch(setStatus(STATUSES.ERROR))
     }
    }
}