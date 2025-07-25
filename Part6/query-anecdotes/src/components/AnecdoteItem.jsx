import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnecdote } from '../requests'
import PropTypes from 'prop-types'
import { useNotification } from './NotificationContext'
const AnecdoteItem = ({ anecdote }) => {
  const queryClient = useQueryClient()
  const [,dispatch]=useNotification()

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const handleVote = () => {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({type:'SET',payload:`you voted '${anecdote.content}'`})
    setTimeout(()=>{
        dispatch({type:'CLEAR'})
    },5000)
  }

  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  )
}

AnecdoteItem.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired
}

export default AnecdoteItem
