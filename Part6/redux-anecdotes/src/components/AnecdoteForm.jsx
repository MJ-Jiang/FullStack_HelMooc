import {  useDispatch } from 'react-redux'
import {useRef} from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
const AnecdoteForm=()=>{
    const dispatch = useDispatch()
    const inputRef= useRef()
    const addAnecdote=async(event)=>{
        event.preventDefault()
         const content = inputRef.current.value.trim()
         if(!content) return
         dispatch(createAnecdote(content))
         dispatch(setNotificationWithTimeout(`'${content}' has been created`,5));
         inputRef.current.value=''
    }
    return (
        <form onSubmit={addAnecdote}>
            <div><input ref={inputRef}/></div>
            <button type="submit">create</button>
        </form>
    )
}
export default AnecdoteForm