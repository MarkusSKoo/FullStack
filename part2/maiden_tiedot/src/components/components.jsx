import Weather from './weather'

export const Language = ({ language }) => {
  return <li>{language}</li>
}

export const Flag = ({ flags }) => {
  return <img src={flags.png} alt={flags.alt}/>
}

export const CountryDisplayAll = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <br />

      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <br />

      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([key, language]) => <Language key={key} language={language} />)}
      </ul>

      <Flag flags={country.flags} />
      <Weather country={country} />
    </div>
  )
}

export const Country = ({ country, setSearch }) => {
  return (
    <li>
        {country.name.common}
        <button onClick={() => setSearch(country.name.common)}>Show</button>
    </li>
  )
}

export const Countries = ({ countries, setSearch }) => {
  if (countries.length > 10) {
    return <div><p>Too many matches, specify another filter</p></div>
  }

  else if (countries.length > 1 && countries.length <= 10) {
    return (
      <div>
        <ul>
          {countries.map(country => <Country key={country.name.official} country={country} setSearch={setSearch}/>)}
        </ul>
      </div>
    )
  }

  else if (countries.length === 1) {
    return <CountryDisplayAll key={countries[0].name.official} country={countries[0]} />
  }
}