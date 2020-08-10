const express = require('express')
const app = express()

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

app.use(express.json())

const morgan = require('morgan')

morgan.token('post-data', function (req, res) {
  /* console.log(req.method)
  if (req.method === "POST") {
    return JSON.stringify(req.body) 
  } else {
    return ""
  } */
  return JSON.stringify(req.body) 
  
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/info', (req, res) => {
    res.send("Phonebook has info for " + persons.length + " people<p>" + new Date() + "</p>")
    //res.send('<h1>Hello World!</h1>')
    })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })

  const generateId = () => {
    const id = Math.floor(Math.random() * (999999 - 1000) + 1000)
    console.log(`creted new id: ${id}`)
    const test = persons.filter(person => person.id === id)
    if (test.length > 0) {
        console.log(`${id} already in use..`)
    }
    return id
  }
  
  app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (!body.name) {
      return res.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return res.status(400).json({ 
          error: 'number missing' 
        })
      }

    const personTest = persons.find(person => person.name === body.name)

    if (personTest) {
        return res.status(400).json({ 
            error: 'name already in database! Name must be unique' 
          })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }

  
    persons = persons.concat(person)
  
    res.json(person)
  })




  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })