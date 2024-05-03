require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

// Custom token joka näyttää pyynnön bodyn (käytetään POSTissa)
morgan.token('body', (req) => JSON.stringify(req.body))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

///////////
// Routes
app.get('/', (req, res) => {
  res.send('<h1>Hei</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const numberOfPeople = Object.keys(persons).length
  const date = new Date()
  res.send(`<p>Phonebook has info for ${numberOfPeople} people <hr>${date}</p>`)
})

// Lisää henkilö luetteloon
app.post('/api/persons', morgan(':body'), (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  if (person.name === "") {
    const error = new Error('Name cannot be empty')
    error.name = "NameError"
    return next(error)
  }
  else if (person.number === "") {
    const error = new Error('Number cannot be empty')
    error.name = "NumberError"
    return next(error)
  }

  person.save()
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
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

// Päivitä henkilön numero
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

////////////
// Handlers
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'NameError') {
    return res.status(400).send({ error: 'empty name' })
  }
  else if (error.name === 'NumberError') {
    return res.status(400).send({ error: 'empty number' })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

////////
// Port
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})