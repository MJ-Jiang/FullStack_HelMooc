import React from "react"
import { useState}from "react" 



const PersonForm =({addObject,newName,newNumber,handleNameChange,handleNewNumberChange})=>{
    return (
       
     <form onSubmit={addObject}>
        <div>
          name: <input value={newName}
          onChange={handleNameChange} />
        </div>
          <div>
          number: <input value={newNumber}
          onChange={handleNewNumberChange} />
        </div>
    
        <div>
          <button type="submit">add</button>
        </div>
      </form>
       
      
    )
}
export default PersonForm