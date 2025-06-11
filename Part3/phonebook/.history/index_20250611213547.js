require('dotenv').config() 
const morgan = require('morgan')
const express = require('express')
const app = express()
const Person = require('./models/person') 
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(express.json()) //access the data easily
//3.7
app.use(morgan('tiny')) 
app.use(express.static('dist'))
// let notes = [
//    { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]






morgan.token(
  'body',(req,res)=>{
        if (req.method==='POST'){
            return JSON.stringify(req.body) //converts a JavaScript value to a JSON string
        }
        return ''
    }
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms: body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
     Person.find({}).then(person=>{
         response.json(person)
     })
})

//3.2
app.get('/info',(request,response)=>{
    const nowData=new Date().toString()
    Person.countDocuments({}).then(count=> {
        response.send(`<div>
                        <p>Phonebook has info for ${count} people</p>
                        <p>${nowData}</p>
                        </div>`)
        })

   
})
//3.3
app.get('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    Person.findById(id).then(note => {
        if (note) {    response.json(note) 
   
        } else {
            response.status(404).end()
        } }  
    )
   
})
//3.4
app.delete('/api/persons/:id',async(request,response)=>{
    const id=request.params.id
    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    }).catch(error => {
        console.error(error)
        response.status(500).json({ error: 'failed to delete' })
    })  
})
//3.6
app.post('/api/persons',(request,response)=>{
    const body=request.body
    if(!body.name){
        return response.status(400).json({
            error: 'name missing',
        })                                                  
       
    }
    if(!body.number){
        return response.status(400).json({
            error: 'number missing',
        })      
    }
    const existingPerson = await Person.findOne({name:body.name})
    if(existingPerson){
        return response.status(400).json({
            error: 'name must be unique',
        })
    }
   
    const person=new Person({
        name:body.name,
        number:body.number})
    person.save().then(savedPerson => {
        response.json(savedPerson) })   
})