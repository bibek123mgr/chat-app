import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import { API } from "../global/http";

const initialState= {
    data: [],
    Status:STATUSES.IDLE
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage(state, action) {
            state.data=action.payload
        },
        setStatus(state, action) {
            state.Status=action.payload
        }
    }
})

export const { setMessage, setStatus } = messageSlice.actions
export default messageSlice.reducer


export function fetchMessage(id) {
    return async function fetchMessageThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get(`api/v1/messages/${id}`,)
            dispatch(setMessage(response.data.data.message))
            dispatch(setStatus(STATUSES.SUCCESS))            
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
        }
    }
}

export function postMessage(id,fromData) {
    return async function postMessageThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post(`api/v1/messages/${id}`,fromData)
            console.log(response.data.data)
            dispatch(setStatus(STATUSES.SUCCESS))            
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
        }
    }
}