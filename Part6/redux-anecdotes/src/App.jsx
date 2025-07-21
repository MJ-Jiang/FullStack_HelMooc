import { useSelector, useDispatch } from 'react-redux'
import {useRef} from 'react'

const App = () => {
  const anecdotes = useSelector(state => state)
  const sortedAndecdotes=[...anecdotes].sort((a,b)=>b.votes-a.votes)
  const dispatch = useDispatch()
  const inputRef= useRef()

  const vote = (id) => {
    dispatch({
      type: 'VOTE',
      payload:id
    })
  }
  const addAnecdote=(event)=>{
    event.preventDefault()
    const content = inputRef.current.value
    if (content.trim() === '') {
      return
    }
    dispatch({
      type: 'NEW_ANECDOTE',
      payload: content
    })
    inputRef.current.value = ''
  }

  return (
    <div>
      <h2>Anecdotes</h2>
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
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input ref={inputRef}/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App