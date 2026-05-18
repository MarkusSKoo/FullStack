import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        if (!country) return

        console.log('Fetching weather')
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital},${country.cca2}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`)
            .then(response => {
                setWeather(response.data)
                console.log(response.data)
            })
    }, [country])

    if (weather) {
        return (
            <div>
                <h2>Weather in {country.capital}</h2>
                <p>Temperature {weather.main.temp} Celsius</p>
                <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="weather icon"
                />
                <p>Wind {weather.wind.speed} m/s</p>
            </div>
        )
    }
}

export default Weather