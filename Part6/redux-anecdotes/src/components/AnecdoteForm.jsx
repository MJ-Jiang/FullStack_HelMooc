import {  useDispatch } from 'react-redux'
import {useRef} from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdoteService'
const AnecdoteForm=()=>{
    const dispatch = useDispatch()
    const inputRef= useRef()
    const addAnecdote=async(event)=>{
        event.preventDefault()
         const content = inputRef.current.value.trim()
         if(!content) return
         const newAnecdote=await anecdoteService.createNew(content)
         dispatch(createAnecdote(newAnecdote))
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