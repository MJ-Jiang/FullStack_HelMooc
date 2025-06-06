import { use, useEffect, useState } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
  axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
    .catch(error => {
      console.error('Error fetching data:', error)  
    })
}, [])

  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]=useState('')

  const [filter,setFileter]=useState('')
  const handleNameChange=(event)=>{
    setNewName(event.target.value)
  }
  const handleNewNumberChange=(event)=>{
    setNewNumber(event.target.value)
  }
  const addName=(event)=>{
    event.preventDefault()
    const nameObject={
      name:newName,
      number:newNumber,
      id: persons.length + 1
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }
  const filteredPersons = persons.filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
  )
  const handleFilterChange = (event) => {
  setFileter(event.target.value)
  } 


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange}/>
     
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNewNumberChange={handleNewNumberChange}   
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons}/>
    
       
     
    </div>
  )
}

export default App
