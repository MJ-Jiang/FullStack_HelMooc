import Services from './Services'
import { useEffect,useState } from 'react'
const CountryDetail=({country})=>{
    const[weather,setWeather]=useState(null)
    useEffect(()=>{
        if(country.capital&&country.capital.length>0){
            Services.getWeather(country.capital[0])
            .then(data=>setWeather(data))
            .catch(error=>console.error("Error fetching weather data:", error))
        }

    },[country.capital])
    return(
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital {country.capital?.[0]}</p>
           {/*If capital exists, take its first element;If capital is undefined/null, return undefined without error.*/}
            <p>Area {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages || {}).map((language, index) => (
                    <li key={index}>{language}</li>
                ))} 
            </ul>
            <img src={country.flags.png} alt="flag" width="150"/>
            <h2>Weather in {country.capital?.[0]}</h2>
            {weather?(
                <div>
                    <p>Temperature {weather.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
            <p>Wind {weather.wind.speed} m/s</p>
                </div>
            ):(<p>Loading weather...</p>)}
            
        </div>
    )

}
export default CountryDetail