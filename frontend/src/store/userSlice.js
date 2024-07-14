import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/http/Type";
import { API } from "../global/http";


const initialState= {
    friends: [],
    users:[],
    status:STATUSES.IDLE
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload
        },
        setStatus(state, action) {
            state.data=action.payload
        },
    }
})

export const { setUsers, setStatus } = userSlice.actions
export default userSlice.reducer


export function fetchUsers(name) {
    return async function fetchUsersThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get(`api/v1/users?name=${name}`)
            dispatch(setUsers(response.data.data))

            dispatch(setStatus(STATUSES.SUCCESS))
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR))
        }
    }
}

// export function fetchUser(name) {
//     return async function fetchUserThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING))
//         try {
//             const response = await API.get(`api/v1/friends?name=${name}`)
//             dispatch(setUsers(response.data.data))
//             dispatch(setStatus(STATUSES.SUCCESS))
//         } catch (error) {
//             dispatch(setStatus(STATUSES.ERROR))
  
//         }
//     }
// }