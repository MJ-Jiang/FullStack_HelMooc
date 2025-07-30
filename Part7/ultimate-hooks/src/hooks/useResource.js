import { useEffect, useState } from "react"
import axios from "axios"

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])
/*When the component is loaded (or when baseUrl changes), a GET request is sent to the server to obtain all resources and save them to the resources state.*/  useEffect(()=>{
    axios.get(baseUrl).then(response=>{
        setResources(response.data)
    })
  },[baseUrl])

  const create = async(resource) => {
    const response=await axios.post(baseUrl,resource)
    setResources(resources.concat(response.data))
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}
export default useResource