const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(express.json()) //access the data easily
//3.7
app.use(morgan('tiny')) 
app.use(express.static('dist'))
let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]






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
//3.1
app.get('/api/persons', (request, response) => {
  response.json(notes)
})

//3.2
app.get('/info',(request,response)=>{
    const nowData=new Date().toString()
    const count=notes.length
    response.send(`<div>
                    <p>Phonebook has info for ${count} people</p>
                    <p>${nowData}</p>
                    </div>`)
})
//3.3
app.get('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    const note=notes.find(note=>note.id===id)
    if (note){
        response.json(note)

    }else{ response.status(404).end()}
})
//3.4
app.delete('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    notes=notes.filter(note=>note.id!==id)
    response.status(204).end()
})
//3.6
const generatedId=()=>{
    const randomID=Math.floor(Math.random()*10000)
    return randomID.toString()  
}
app.post('/api/persons',(request,response)=>{
    const body=request.body
    if(!body.name){
        return response.status(400).json({
            error: 'name missing',
        })                                                  
       
    }else if(!body.number){
        return response.status(400).json({
            error: 'number missing',
        })      
    }else if(notes.find(note=>note.name===body.name)){
        return response.status(400).json({
            error: 'name must be unique',
        })
    }
    const note={
        id: generatedId(),
        name:body.name,
        number:body.number}
    notes=notes.concat(note)
    response.json(note)

})

const PORT = process.env.PORT||3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)