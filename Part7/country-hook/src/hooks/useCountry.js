import { useState,useEffect } from "react";
import axios from "axios";

const useCountry=(name)=>{
    const [country,setCountry]=useState(null)
    useEffect(()=>{
        if (!name) return
        axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then(response=>{
            const data=response.data
            setCountry({
                found:true,
                data:{
                    name:data.name.common,
                    capital:data.capital?.[0],
                    population:data.population,
                    flag:data.flags.svg
                }
            })
        })
        .catch(()=>{
            setCountry({found:false})
        })
    },[name])
    return country
}
export default useCountry