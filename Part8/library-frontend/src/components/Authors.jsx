import { useQuery,useMutation } from "@apollo/client";
import { All_AUTHORS,EDIT_AUTHOR } from "../queries";
import { useState, useEffect } from 'react';

const Authors = ({show}) => {
  const {loading,error,data}=useQuery(All_AUTHORS)
  const [editAuthor,{loading:saving}]=useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: All_AUTHORS }], 
    awaitRefetchQueries: true,
  })
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  useEffect(()=>{
    if(!name && data?.allAuthors?.length) { //data?.allAuthors means “if data is null/undefined, return undefined instead of throwing.”
      setName(data.allAuthors[0].name)
    }
  },[data,name])

  if (!show) {
    return null
  }
  if(loading){
    return <div>loading...</div>
  }
  if(error){
    return <div>Error loading authors: {error.message}</div>
  }
  const authors = data.allAuthors
  const submit=async(event)=>{
    event.preventDefault()
    const year=parseInt(born,10)
    if(!name || Number.isNaN(year)) return
    await editAuthor({variables:{name, setBornTo:year}})
    setName('') 
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>set birthyear</h3>
      <form onSubmit={submit} style={{marginTop:8}}>
        <div>
        <select value={name} onChange={({target})=>setName(target.value)}>
          {authors.map((a)=>(
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
        </div>
        <div>born
        <input type='number' value={born} onChange={({target})=>setBorn(target.value)} />
        </div>
        <button type='submit' disabled={saving}>{saving?"saving...":"update author"}</button></form>
    </div>
  )
}

export default Authors
