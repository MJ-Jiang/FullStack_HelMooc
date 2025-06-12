import { use, useEffect, useState } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import personService from './Services'
import Notification from './Notification'
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]=useState('')
  const [filter,setFilter]=useState('')
  const [showMessage, setShowMessage]=useState(null)

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
          setShowMessage({text:`${returnData.name} 's number is updated`,type:'success'} )
          setTimeout(()=>{
            setShowMessage(null)},5000)
        })
        .catch(error=>{
           setShowMessage({text:`Information of ${existingPerson.name} has already been removed from the server`,type:'error'})
          setTimeout(() => setShowMessage(null), 5000)
        })  
      }

    }else {
      //task2
      // personService
      //   .create(nameObject)
      //   .then(returnData => {
      //     setPersons(persons.concat(returnData))
      //     setNewName('')
      //     setNewNumber('')
      //     setShowMessage({text:`Added ${returnData.name}`,type:'success'})
      //     setTimeout(() => setShowMessage(null), 5000)
      //   })
      //   .catch(error => {
      //     console.error('Error adding person:', error)
      //   })
      //3.19
        personService.create(nameObject)
        .then(returnData=>{
          setPersons(persons.concat(returnData))
          setNewName('')
          setNewNumber('')
          setShowMessage({text:`Added ${returnData.name}`,type:'success'})
          setTimeout(() => setShowMessage(null), 5000)  
        })
        .catch(error=>{
          console.log(error.response.data.error)
          setShowMessage({text:error.response.data.error,type:'error'})
          setTimeout(() => setShowMessage(null), 5000)
        })
    }
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
      <Notification message={showMessage} />
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
