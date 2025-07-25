import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteItem from './components/AnecdoteItem'
import { useQuery} from '@tanstack/react-query'
import { getAnecdotes} from './requests'
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
  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
  
    {anecdotes.map(anecdote =>
        <AnecdoteItem key={anecdote.id} anecdote={anecdote} />
      )}
    </div>
  )
}

export default App
