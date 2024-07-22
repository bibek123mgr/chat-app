import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    createGroup: false
}

const togglerSlice = createSlice({
    name: 'toggler',
    initialState,
    reducers: {
        toggleCreateGroup(state) {
            state.createGroup = !state.createGroup;
        }
    }
})

export const { toggleCreateGroup } = togglerSlice.actions;
export default togglerSlice.reducer;
