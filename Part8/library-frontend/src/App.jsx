import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useQuery,useApolloClient,useSubscription } from "@apollo/client";
import Notify from "./components/Notify";
import Recommendation from "./components/Recommendation";
import { All_BOOKS, BOOK_ADDED } from './queries'
export const updateCache = (cache, query, addBook) => {
  const uniqByTitleAuthor = (a) => {
    let seen = new Set()
    return a.filter((book) => {
      let k = `${book.title}-${book.author.name}`
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitleAuthor(allBooks.concat(addBook)),
    }
  })
}
const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken]=useState(null)
  const [errorMessage, setErrorMessage] = useState(null);
  const client=useApolloClient()

  const notify=(message)=>{
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000) //clear the error message after 5 seconds  
  }

  const logout=()=>{
    setToken(null)
    localStorage.clear()
    client.resetStore() //resets the Apollo Client cache  
    setPage("authors") //reset the page to authors after logout
  }
  useEffect(()=>{
    if(token){
      setPage("authors")
    }
  },[token])
        
  useSubscription(BOOK_ADDED, {
    onData: ({ data,client }) => { 
      const bookAdded = data.data.bookAdded;
      notify(`New book added: ${bookAdded.title} by ${bookAdded.author.name}`);
     updateCache(client.cache, { query: All_BOOKS }, bookAdded);
      //update the cache with the new book added
    }
  });
  return (
    <div>
        <Notify errorMessage={errorMessage} />

        <div style={{marginBottom: 10}}>
           <button onClick={() => setPage("authors")}>authors</button>
            <button onClick={() => setPage("books")}>books</button>
            {token?(
              <>
                <button onClick={() => setPage("add")}>add book</button>
                <button onClick={() => setPage("recommend")}>recommend</button>
                <button onClick={logout}>logout</button>
              </>
            ):(
              <button onClick={() => setPage("login")}>login</button>
            )}
       
        </div>
        {page==='login'?(
          <LoginForm setToken={setToken} setError={notify}/>

        ):(
          <>
            <Authors show={page === "authors"} canEdit={!!token} />
            <Books show={page === "books"} />
            <NewBook show={page === "add" && !!token} />
            <Recommendation show={page==='recommend' && !!token} />
          </>
        )}
    </div>
  );
};

export default App;
