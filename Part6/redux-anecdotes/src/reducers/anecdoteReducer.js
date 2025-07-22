import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdoteSlice=createSlice({
  name:'anecdotes',
  initialState:[],
  reducers:{
    voteAnecdote(state,action){
      const id=action.payload
      const anecdoteToVote=state.find(a=>a.id===id)
      if (anecdoteToVote){
        anecdoteToVote.votes+=1
      }
    },
    createAnecdote(state,action){
      state.push(action.payload)
    },
    appendAnecdote(state,action){
      state.push(action.payload)
    },
    setAnecdotes(state,action){
      return action.payload
    }
  }
})


export const { voteAnecdote, createAnecdote,setAnecdotes,appendAnecdote } = anecdoteSlice.actions
export const initializeAnecdotes=()=>{
  return async dispatch=>{
    const anecdotes=await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export default anecdoteSlice.reducer