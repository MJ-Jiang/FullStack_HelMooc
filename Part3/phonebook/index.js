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

app.use(morgan('tiny')) 
app.use(express.static('dist'))


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


app.get('/info',(request,response)=>{
    const nowData=new Date().toString()
    Person.countDocuments({}).then(count=> {
        response.send(`<div>
                        <p>Phonebook has info for ${count} people</p>
                        <p>${nowData}</p>
                        </div>`)
        })

   
})

app.get('/api/persons/:id',(request,response,next)=>{
    const id=request.params.id
    Person.findById(id).then(note => {
        if (note) {    response.json(note) 
   
        } else {
            response.status(404).end()
        }
     }).catch(error=>next(error)) 
   
})

app.delete('/api/persons/:id',async(request,response,next)=>{
    const id=request.params.id
    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))  
})

app.post('/api/persons', async (request, response) => {
    const body = request.body
    if (!body.name) {
        console.log('name missing')
        return response.status(400).json({
            error: 'name missing',
        })     

    }
    if (!body.number) {
        console.log('number missing')   
        return response.status(400).json({
            error: 'number missing',
        })     
    }
    const existingPerson = await Person.findOne({ name: body.name })
    if (existingPerson) {
        console.log('duplicate name found')
        return response.status(400).json({
            error: 'name must be unique',
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error=>next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name,number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name=name
      person.number=number

      return person.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
//If next was called without an argument, then the execution would simply move onto the next route or middleware. If the next function is called with an argument, then the execution will continue to the error handler middleware.
