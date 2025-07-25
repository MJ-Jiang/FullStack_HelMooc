import { useMutation,useQueryClient } from "@tanstack/react-query"
import {createAnecdote} from '../requests';
const AnecdoteForm = () => {
  const queryClient=useQueryClient()
  const newAnecdoteMutation=useMutation({
    mutationFn:createAnecdote,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['anecdotes']})
    }
  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if(content.length<5){
      console.log('Anecodte must be at least 5 characters')
      return
    }
    newAnecdoteMutation.mutate({content,votes:0})
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
