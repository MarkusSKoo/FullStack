export const Filter = ({ search, onChange }) => {
  return (
        <form>
          <div>
            Filter shown with <input
                                value={search}
                                onChange={onChange}
                              />
          </div>
        </form>
  )
}

export const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
          <div>
            Name: <input
                    value={props.newName}
                    onChange={props.handleNameChange}
                  />
          </div>
          <div>
            Number: <input
                    value={props.newNumber}
                    onChange={props.handleNumberChange}
                  />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
  )
}

export const Person = ({ person, destroy }) => <li>
    {person.name} {person.number} 
    <button onClick={() => destroy(person.id)}>delete</button>
    </li>

export const Persons = ({ persons, destroy }) => {
  return (
    <div>
        <ul>
            {persons.map(person =>
              <Person
              key={person.id}
              person={person}
              destroy={destroy}
              />
            )}
        </ul>
    </div>
  )
}
