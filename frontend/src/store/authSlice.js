import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import { API } from "../global/http";
import toast from "react-hot-toast";
import { setChats } from "./chatSlice";
import { setMessage } from "./messageSlice";


const initialState = {
    data: {},
    status:STATUSES.IDLE
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.data = action.payload
        },
        setStatus(state, action) {
          state.status=action.payload           
        },
        reSetStatus(state) {
           state.data=STATUSES.IDLE 
        }
    }
})

export const { setUser, logout ,setStatus,reSetStatus} = authSlice.actions
export default authSlice.reducer

export function loginUser(data) {
    return async function loginUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post(`api/v1/auth/login`, data)
            dispatch(setUser(response.data.data))
            dispatch(setStatus(STATUSES.SUCCESS))
            toast.success(response.data.message)
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
                toast.error(error.message);
        }
    }
}

export function registerUser(data) {
    return async function registerUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('api/v1/auth/register', data);
            if (response.status === 201) {
                setUser(null);
                dispatch(setStatus(STATUSES.SUCCESS));
                toast.success(response.data.message);
            } else {
                toast.error('Unable to register');
            }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred');
            }
            console.log(error)
        }
    };
}

export function fetchUserProfile() {
    return async function fetchUserProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/v1/profile');
            dispatch(setUser(response.data.data))
            dispatch(setStatus(STATUSES.SUCCESS));
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
        }
    };
}

export function logoutUser() {
    return async function logoutUserThunk(dispatch) {
       dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post(`api/v1/auth/logout`)
            dispatch(setUser(null))
            dispatch(setChats(null))
            dispatch(setMessage(null))
            dispatch(setStatus(STATUSES.SUCCESS))
            toast.success(response.data.message)
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
            toast.error(error.response.data.message)
        }
    }
}
