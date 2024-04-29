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

app.get('/', (req, res) => {
  res.send('<h1>Hei</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(notes => {
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
  const id = Math.floor(Math.random() * 10000000)

  const person = req.body
  person.id = id

  if (!person.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  else if (!person.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  else if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  } else {
    persons = persons.concat(person)
    res.json(person)
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
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  // Poiston onnistuttua annetaan koodi 204 (No Content)
  res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})