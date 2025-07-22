import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdoteSlice=createSlice({
  name:'anecdotes',
  initialState:[],
  reducers:{
    updateAnecdote(state,action){
      const updated=action.payload
      return state.map(a=>a.id===updated.id?updated:a)
    },
    appendAnecdote(state,action){
      state.push(action.payload)
    },
    setAnecdotes(state,action){
      return action.payload
    }
  }
})


export const { updateAnecdote,setAnecdotes,appendAnecdote } = anecdoteSlice.actions
export const initializeAnecdotes=()=>{
  return async dispatch=>{
    const anecdotes=await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const createAnecdote=content=>{
  return async dispatch =>{
    const newAnecdote=await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}
export const voteAnecdote=(anecdote)=>{
  return async(dispatch)=>{
    const updatedAnecdote={
      ...anecdote,
      votes:anecdote.votes+1
    }
  
  const response=await anecdoteService.update(updatedAnecdote)
  dispatch(updateAnecdote(response))
}
}
export default anecdoteSlice.reducer