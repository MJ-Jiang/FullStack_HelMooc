import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";
import Notify from "./components/Notify";
import Recommendation from "./components/Recommendation";
import { set } from "mongoose";
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
            <Recommendation show={page==='recommend'} />
          </>
        )}
    </div>
  );
};

export default App;
