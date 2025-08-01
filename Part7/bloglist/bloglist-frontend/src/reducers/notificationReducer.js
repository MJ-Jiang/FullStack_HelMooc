import { createSlice } from '@reduxjs/toolkit'
const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return null
        },
    },
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const showNotification = (messageObject, duration = 5) => {
    return (dispatch) => {
        dispatch(setNotification(messageObject))
        setTimeout(() => {
            dispatch(clearNotification())
        }, duration * 1000)
    }
}
export default notificationSlice.reducer
