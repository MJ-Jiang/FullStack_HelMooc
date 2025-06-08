import CountryDetail from "./CountryDetail"

const CountryList=({countries,onShow, selectedCountry})=>{
    return(
        <div>
            <div>
               {countries.map((country)=>(
                <div key={country.cca3}>{country.name.common}
                <button onClick={()=>onShow(country)}>Show</button>
                {/* onShow tells the upper layer "which country I clicked on */}
                {selectedCountry&&selectedCountry.cca3===country.cca3 &&(
                    <CountryDetail country={country}/>  
                )}
                </div>
               ))}      
            </div>
            
        </div>
    )

}
export default CountryList