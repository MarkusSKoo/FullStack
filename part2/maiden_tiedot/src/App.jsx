import { useState, useEffect } from 'react'
import axios from 'axios'
import { Language, Flag, CountryDisplayAll, Country, Countries } from './components/components'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {

    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const onChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <form>
        Find country: <input value={search} onChange={onChange} />
      </form>
      <br />
      <Countries countries={filteredCountries} setSearch={setSearch}/>
    </div>
  )
}

export default App
