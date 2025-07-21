import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)
  const vote = (id) => {
    dispatch(voteAnecdote(id));
    const votedAnecdote = anecdotes.find(a => a.id === id);
    dispatch(setNotificationWithTimeout(`You voted '${votedAnecdote.content}'`,5));
  }
  const filteredAnecdotes = anecdotes.filter(a=>a.content.toLowerCase().includes(filter.toLowerCase()))
  const sortedAndecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
  return (
    <div>
      {sortedAndecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default AnecdoteList