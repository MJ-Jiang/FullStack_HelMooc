import { useQuery } from "@apollo/client";
import { All_BOOKS } from "../queries";
import { useState,useMemo } from "react";
import { use } from "react";
const Books = ({show}) => {
  const [genre,setGenre]=useState('')
  const {data,loading,error}=useQuery(All_BOOKS, {
    variables: { genre:genre || null}
  });
  
  const books = data?.allBooks ?? []
  const {data:allData}=useQuery(All_BOOKS)
  const allBooksForGenre=allData?.allBooks ?? [] //always the complete, unfiltered list of all books.
  const genres = useMemo(
    () => Array.from(new Set(allBooksForGenre.flatMap(b => b.genres))).sort(),
    [allBooksForGenre]
  )
//It only re-runs the function when values in the dependency array ([books]) change.
//books.flatMap(b => b.genres) map transforms each book to its genres array.flatMap then flattens the arrays by one level into a single array.
//A Set removes duplicates. then convert it back to an array
  if (!show) {
    return null
  }
  if(loading){
    return <div>loading...</div>
  }
  if(error) return <div>error:{error.message}</div>
  //8.19
  //const visible=genre?books.filter(b=>b.genres.includes(genre)):books


  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <strong>{genre}</strong></p>}
      
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop: 10}}>
        {genres.map((g) => (
          <button 
            key={g} 
            style={{marginRight: 5, backgroundColor: g === genre ? 'lightblue' : 'white'}}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
        <button onClick={() => setGenre('')}>all genres</button>

      </div>
    </div>
  )
}

export default Books
/*Click button → onClick fires → calls setGenre(g) → updates state → React re-renders → filter uses new state → UI updates.
React calls setGenre("classic"). so next time React renders, uses genre = "classic"*/