import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import { API } from "../global/http";
import toast from "react-hot-toast";



const initialState = {
    data: {},
    isLogin:false,
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
        },
        setLoginLogout(state, action) {
            state.isLogin=action.payload
        },
        setProfile(state, action) {
        state.data.name = action.payload.name;
        state.data.email = action.payload.email;
       }
    }
})

export const { setUser, logout ,setStatus,reSetStatus,setLoginLogout,setProfile} = authSlice.actions
export default authSlice.reducer

export function loginUser(data) {
    return async function loginUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.post(`api/v1/auth/login`, data)
            dispatch(setUser(response.data.data))
            dispatch(setLoginLogout(true))
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
                dispatch(setUser(response.data.data))
                dispatch(setLoginLogout(true))
                dispatch(setStatus(STATUSES.SUCCESS));
                toast.success(response.data.message);
            }
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
            toast.error(error.response.data.message);
        };
    }
}

export function fetchUserProfile() {
    return async function fetchUserProfileThunk(dispatch, getState) {
        const {auth} = getState()
        if (Object.keys(auth.data).length > 0) {
            return; 
        }
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get('api/v1/profile');
            dispatch(setUser(response.data.data))
            dispatch(setLoginLogout(true))
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
            dispatch(setStatus(STATUSES.SUCCESS))
            toast.success(response.data.message)
            window.location.href = '/'
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
            toast.error(error.response.data.message)
        }
    }
}

export function editProfile(data) {
    return async function editProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.patch('api/v1/profile', data);
            dispatch(setProfile(data))
            dispatch(setStatus(STATUSES.SUCCESS));
            toast.success(response.data.message);
            window.location.href = '/'
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
            toast.error(error.response.data.message);
        }
    }  
}

export function deleteMe(password) {
    return async function editProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.delete('api/v1/profile',{data:{password}} );
            dispatch(setStatus(STATUSES.SUCCESS));
            window.location.href = '/'
            toast.success(response.data.message);
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
            toast.error(error.response.data.message);
        }
    }  
}

export function updateMyPassword(data) {
    return async function editProfileThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('api/v1/profile', data);
            dispatch(setStatus(STATUSES.SUCCESS));
            toast.success(response.data.message);
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
            toast.error(error.response.data.message);
        }
    }  
}