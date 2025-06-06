import { use, useEffect, useState } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import personService from './Services'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]=useState('')
  const [filter,setFilter]=useState('')

  useEffect(() => {
    personService
    .getAll()
    .then(initialData=>{setPersons(initialData)
    })
    .catch(error => {
      console.error('Error fetching data:', error)  
    })
  }, [])

  

  const handleNameChange=(event)=>{
    setNewName(event.target.value)
  }
  const handleNewNumberChange=(event)=>{
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
  setFilter(event.target.value)
  } 

  const addObject=(event)=>{
    event.preventDefault()
    const existingPerson=persons.find(person=>person.name===newName)
    const nameObject = {
    name: newName,
    number: newNumber
    }
    if (existingPerson){
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        const updatedPerson={...existingPerson,number:newNumber}
        //Create a new object, copy the existing contact information, but change the number to newNumber
        personService
        .updateNumber(existingPerson.id,updatedPerson)
        //Call the backend interface, send an update request, and change the contact number to a new one
        .then(returnData=>{
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnData))
          //Update the local state persons and replace the old contacts with new data
          setNewName('')
          setNewNumber('')  
        })
        .catch(error=>{
          console.error('Error updating person:', error)
        })  
      }

    }
    personService
    .create(nameObject)
    .then(returnData=>{
      setPersons(persons.concat(returnData)) // add one to the list
      setNewName('')
      setNewNumber('')
    })
    .catch(error=>{
      console.error('Error adding person:', error)
    })
    
  }

  const filteredPersons = persons.filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleDelete=(id)=>{
    if (window.confirm(`Delete ${persons.find(person=>person.id===id).name}?`)){
      personService
      .deletePerson(id)
      .then(()=>{
        setPersons(persons.filter(person=>person.id!==id))

      }).catch(error=>{
        console.error('Error deleting person:',error)
      })
  }}
  
 

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange}/>
     
      <h3>Add a new</h3>
      <PersonForm
        addObject={addObject}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNewNumberChange={handleNewNumberChange}   
      />
      <h3>Numbers</h3>
      <div>
          <Persons persons={filteredPersons} handleDelete={handleDelete}/>   
      </div>
  
    </div>
  )
}

export default App
