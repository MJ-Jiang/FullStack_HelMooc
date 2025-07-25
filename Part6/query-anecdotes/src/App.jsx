import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './requests'
const App = () => {

  const {data,isLoading,isError}=useQuery({
    queryKey:['anecdotes'],
    queryFn:getAnecdotes,
    retry:false
  })
  if (data) {
  console.log(JSON.parse(JSON.stringify(data)))
 }
  if(isLoading){
    return <div>loading data...</div>
  }
  if(isError){
    return <div>Anecdote service not available due to problems in server</div>
  }

  const anecdotes = data
  const handleVote = (anecdote) => {
    console.log('vote')
  }
  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
