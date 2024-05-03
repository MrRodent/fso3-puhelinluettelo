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
app.post('/api/persons', morgan(':body'), (req, res) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  if (!person.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  else if (!person.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  // }
  // else if (persons.find(p => p.name === person.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  } else {
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  }
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

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

////////////
// Handlers
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
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