import { use, useEffect, useState } from 'react'
import Services from './Services'
import CountryList from './CountryList'
import CountryDetail from './CountryDetail'

const App=()=>{
  const[query,setQuery]=useState('')
  const[countries,setCountries]=useState([])
  const[selectedCountry,setSelectedCountry]=useState(null)
  useEffect(
    ()=>{
      if(query){
        Services.getAll().then(data=>{
          const filtered=data.filter(country=>{
            return country.name.common.toLowerCase().includes(query.toLowerCase())
          })
        setCountries(filtered)
        setSelectedCountry(null)
        })
      }else{
        setCountries([])
        setSelectedCountry(null)
      }

    },[query] 
  )

  const handleSearch=(e)=>{
    setQuery(e.target.value)
  }
  const handleShow=(country)=>{
    setSelectedCountry(country)
  }
  {/*Store the selected country in the selectedCountry state */}
  return (
    <div>
      <div>
         <p>find countries</p>
         <input value={query} onChange={handleSearch}/>
         {countries.length>10 &&<p>Too many matches, specify another filter.</p>}
       
         {countries.length<=10&&countries.length>1&&<CountryList countries={countries} onShow={handleShow} selectedCountry={selectedCountry} />}
         {countries.length===1&&<CountryDetail country={countries[0]} />} 

      </div>
     
    </div>
  )
}

export default App
