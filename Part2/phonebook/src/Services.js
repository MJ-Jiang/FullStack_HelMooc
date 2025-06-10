import axios from "axios";
const baseurl='/api/persons'

const getAll=()=>{
    return axios.get(baseurl).then(response => response.data)
}
const create=(newObject)=>{
    return axios.post(baseurl,newObject).then(response => response.data)
}
const deletePerson=(id)=>{
    return axios.delete(`${baseurl}/${id}`).then(response => response.data)
    //"http://localhost:3001/persons/5"

}
const updateNumber=(id,newObject)=>{
    return axios.put(`${baseurl}/${id}`,newObject).then(response=>response.data)
    //put:Update an existing object (replace)
}
export default{getAll,create,deletePerson,updateNumber}