import { useMutation,useQueryClient } from "@tanstack/react-query"
import {createAnecdote} from '../requests';
import { useNotification } from "./NotificationContext";
const AnecdoteForm = () => {
  const queryClient=useQueryClient()
  const [,dispatch]=useNotification()
  const newAnecdoteMutation=useMutation({
    mutationFn:createAnecdote,
    onSuccess:(newAnecdote)=>{
      queryClient.invalidateQueries({queryKey:['anecdotes']})
      dispatch({type:'SET',payload:`you created '${newAnecdote.content}'`})
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
    },
    onError:(error)=>{
      dispatch({type:'SET',payload:`too short anecdote, must have length 5 or more`})
      setTimeout(()=>{
        dispatch({type:'CLEAR'})
      },5000)
    }
  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content,votes:0})
    

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
