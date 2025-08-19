import { useState } from 'react'
import { useMutation } from "@apollo/client";
import { All_AUTHORS, ADD_BOOK, All_BOOKS } from "../queries";

const NewBook = ({show}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [addBook]= useMutation(ADD_BOOK, {
    refetchQueries: [{ query: All_BOOKS }, { query: All_AUTHORS }],
    awaitRefetchQueries: true,
        onError: (error) => {
          console.error("Error adding book:", error);
    }
  });

  if (!show) {
    return null
  }

  const addGenre=()=>{
    const g=genre.trim()
    if(!g) {
      return
    }
    setGenres(prev=>[...prev, g]) //each call gets the freshest state
    setGenre('')  
  }
  const submit = async (event) => {
    event.preventDefault()
    const publishedNumber=parseInt(published,10)
    if(!title.trim() || !author.trim() || Number.isNaN(publishedNumber)) {
      console.error("All fields are required and published must be a number.")
      return
    }

    await addBook({
       variables: { 
        title:title.trim(),
        author:author.trim(), 
        published: publishedNumber, 
        genres 
      }
    });
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }


  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook