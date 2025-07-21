import{createSlice} from '@reduxjs/toolkit'
const notificationSlice=createSlice({
    name:'notification',
    initialState:'',
    reducers:{
        setNotification(state,action){
            return action.payload
        },
        clearNotification(){
            return ''
        }
    }
})
export const {setNotification,clearNotification}=notificationSlice.actions
export const setNotificationWithTimeout=(content, timeInSeconds)=>{
    return dispatch=>{
        dispatch(setNotification(content))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeInSeconds * 1000)
    }
}
export default notificationSlice.reducer