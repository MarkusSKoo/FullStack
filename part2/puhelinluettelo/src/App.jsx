import { useState, useEffect } from 'react'
import { Filter, PersonForm, Person, Persons } from './Components/Components'
import personService from './services/persons'
import Notification from './Components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [search, setSearch] = useState('')

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService

          .update(person.id, changedPerson)
          .then(returnedPerson => {

            setPersons(persons.map(p =>
              p.id !== person.id ? p : returnedPerson))

            setNotification({
              message: `Updated ${newName} with number ${newNumber}`,
              type: 'success'
            })

            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)

            setNewName('')
            setNewNumber('')
          })

          .catch(error => {
            setNotification({
              message: `Information of ${person.name} has already been removed from the server`,
              type: 'failure'
            })

            setTimeout(() => {
              setNotification({ message: null, type: null })
            }, 5000)

            setNewName('')
            setNewNumber('')
          })
      }
    }

    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))

          setNotification({
            message: `Added ${newName}`,
            type: 'success'
          })

          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)

          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  const destroy = (id) => {
    if (window.confirm('Are you sure?')) {

      personService
        .destroy(id)

        .then(removedPerson => {
          setPersons(prev => prev.filter(p => p.id !== id))
          setNotification({
            message: `Deleted ${removedPerson.name}`,
            type: 'success'
          })

          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
    }
  }

  useEffect(() => {
    personService

      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onChange={handleSearch} />
      <Notification notification={notification} />
      <h2>Add new number</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} destroy={destroy} />
    </div>
  )

}

export default App