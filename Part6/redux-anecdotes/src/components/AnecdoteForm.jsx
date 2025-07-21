import {  useDispatch } from 'react-redux'
import {useRef} from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
const AnecdoteForm=()=>{
    const dispatch = useDispatch()
    const inputRef= useRef()
    const addAnecdote=(event)=>{
        event.preventDefault()
        const content = inputRef.current.value
        if (content.trim() === '') {
            return
        }
        dispatch(createAnecdote(content))
        inputRef.current.value = ''
  }
    return (
        <form onSubmit={addAnecdote}>
            <div><input ref={inputRef}/></div>
            <button type="submit">create</button>
        </form>
    )
}
export default AnecdoteForm