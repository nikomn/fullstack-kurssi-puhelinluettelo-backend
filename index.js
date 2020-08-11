require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

app.use(express.json())

const morgan = require('morgan')

/* console.log('argsit', process.argv)
const password = process.argv[2]
console.log(password) */

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

//let persons = Person.find({})
//console.log(persons)

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send("Phonebook has info for " + persons.length + " people<p>" + new Date() + "</p>")
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
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

  if (body.name === undefined || body.name === "") {
    return res.status(400).json({ error: 'no name defined!' })
  }
  if (body.number === undefined || body.number === "") {
    return res.status(400).json({ error: 'no number defined!' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  /* const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log(person) */
  console.log(req.body)

  Person.findByIdAndUpdate(req.params.id,{$set:req.body})
    .then(result => {
      res.json(req.body)
    })
    .catch(error => next(error))

  

})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

//const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })