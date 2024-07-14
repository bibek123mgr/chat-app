import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import toast from "react-hot-toast";
import { API } from "../global/http";

const initialState = {
    data: [],
    status: STATUSES.IDLE
}

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setRequest(state, action) {
           state.data = action.payload 
        },
        setStatus(state, action) {
           state.status = action.payload 
        },
        removeRequest(state, action) {
            const index = state.data.findIndex((i) => i._id == action.payload)
            if (index != -1) {
                state.data.splice(index,1)
            }
        }
    }
})

export const { setRequest, setStatus,removeRequest } = requestSlice.actions
export default requestSlice.reducer

export function postRequest(id) {
    return async function postRequestThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post(`api/v1/requests`, { userId: id })
            toast.success(response.data.message)  
            dispatch(setStatus(STATUSES.SUCCESS))            
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
            toast.error("Request failed! Please try again.")  
            console.error(error)  
        }
    }
}

export function getRequest() {
    return async function getRequestThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get(`api/v1/requests`)
            dispatch(setRequest(response.data.data))            
            dispatch(setStatus(STATUSES.SUCCESS))
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
            toast.error(error.response.data.message)
        }
    }
}


export function responseRequest(data) {
    return async function responseRequestThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.patch(`api/v1/requests`,data)
            dispatch(removeRequest(data.requestId))
            dispatch(setStatus(STATUSES.SUCCESS))
            if(data.status==='accepted')
                {
                toast.success(response.data.message)
                } else {
                toast.error(response.data.message)
                }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
            toast.error(error.response.data.message)
        }
    }
}

