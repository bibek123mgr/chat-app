import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import toast from "react-hot-toast";
import { API } from "../global/http";

const initialState = {
    data: [],
    status: STATUSES.IDLE
};

const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setGroup(state, action) {
            state.data = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        createGroup(state, action) {
            state.data.push(action.payload);
        },
        deleteGroup(state, action) {
            const index = state.data.findIndex(group => group._id === action.payload);
            if (index !== -1) {
                state.data.splice(index, 1);
            }
        },
        renameGroup(state, action) {
            const index = state.data.findIndex(group => group._id === action.payload.id);
            if (index !== -1) {
                state.data[index].name = action.payload.name;
            }
        },
        addMember(state, action) {
            const index = state.data.findIndex(group => group._id === action.payload.id);
            if (index !== -1) {
                state.data[index].members.push(action.payload.userId)
            } 
        },
        removeMember(state, action) {
            const index = state.data.findIndex(group => group._id === action.payload.id);
            if (index !== -1) {
                state.data[index].members.slice(action.payload.userId,1)
            } 
        },
        leaveGroup(state, action) {
            const index = state.data.findIndex(group => group._id === action.payload);   
            if (index != -1) {
                state.data.slice(index,1)
            }
        }
    }
});

export const { setGroup, setStatus, createGroup, deleteGroup, renameGroup,leaveGroup,removeMember,addMember } = groupSlice.actions;
export default groupSlice.reducer;


export function createMyGroup(data) {
    return async function createMyGroupThunk(dispatch) {
       dispatch(setStatus(STATUSES.LOADING))
        try {
        const response = await API.post(`api/v1/groups`, data)
        dispatch(createGroup(response.data.data))
        dispatch(setStatus(STATUSES.SUCCESS))
        toast.success(response.data.message)
        } catch (error) {
        dispatch(setStatus(STATUSES.ERROR))
     }
    }
}

export function renameGroupname(data) {
    return async function renameGroupnamepThunk(dispatch) {
       dispatch(setStatus(STATUSES.LOADING))
        try {
        const response = await API.post(`api/v1/groups`, data)
        dispatch(createGroup(response.data.data))
        dispatch(setStatus(STATUSES.SUCCESS))
        toast.success(response.data.message)
        } catch (error) {
        dispatch(setStatus(STATUSES.ERROR))
     }
    }
}


export function deleteMyGroup(data) {
    return async function deleteMyGroupThunk(dispatch) {
       dispatch(setStatus(STATUSES.LOADING))
        try {
        const response = await API.post(`api/v1/groups`, data)
        dispatch(createGroup(response.data.data))
        dispatch(setStatus(STATUSES.SUCCESS))
        toast.success(response.data.message)
        } catch (error) {
        dispatch(setStatus(STATUSES.ERROR))
     }
    }
}

export function addMembersToMyGroup(data) {
    return async function addMembersToMyGroupThunk(dispatch) {
       dispatch(setStatus(STATUSES.LOADING))
        try {
        const response = await API.post(`api/v1/groups`, data)
        dispatch(createGroup(response.data.data))
        dispatch(setStatus(STATUSES.SUCCESS))
        toast.success(response.data.message)
        } catch (error) {
        dispatch(setStatus(STATUSES.ERROR))
     }
    }
}
export function leaveAnyGroupGroup(data) {
    return async function leaveAnyGroupGroupThunk(dispatch) {
       dispatch(setStatus(STATUSES.LOADING))
        try {
        const response = await API.post(`api/v1/groups`, data)
        dispatch(createGroup(response.data.data))
        dispatch(setStatus(STATUSES.SUCCESS))
        toast.success(response.data.message)
        } catch (error) {
        dispatch(setStatus(STATUSES.ERROR))
     }
    }
}