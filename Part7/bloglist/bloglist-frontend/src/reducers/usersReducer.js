import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/users'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return await userService.getAll()
})
const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload
        })
    },
})

export default usersSlice.reducer
//extraReducers is used to handle asynchronous actions (such as fetchUsers.fulfilled)
//fulfilled:The request was successful and the data was obtained
//builder.addCase(...) adds the corresponding reducer logic to this asynchronous action
