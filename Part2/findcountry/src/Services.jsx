import axios from "axios";
const baseurl='https://studies.cs.helsinki.fi/restcountries/api/all'
const getAll=()=>{
    return axios.get(baseurl).then(response => response.data)
}
const api_key = import.meta.env.VITE_SOME_KEY
console.log("API Key:", import.meta.env.VITE_SOME_KEY)
const weatherUrl='https://api.openweathermap.org/data/2.5/weather'
const getWeather=(capital)=>{
    const params={q:capital,appid:api_key,units:'metric'
    }
    return axios.get(weatherUrl,{params}).then(response => response.data)
}


export default {getAll,getWeather}