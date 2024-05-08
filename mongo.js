const mongoose = require('mongoose')

if (process.argv.length < 4) {
  console.log('give username and password as arguments')
  process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const name = process.argv[4]
const number = process.argv[5]

const url = `mongodb+srv://${username}:${password}@cluster0.jefgqga.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)


if (process.argv.length === 6) {
  // Lisää henkilö luetteloon
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log(`added ${name} number ${number} to the phonebook`)
    mongoose.connection.close()
  })
}
else if (process.argv.length === 4) {
  // Tulostaa kantaan tallennetut muistiinpanot
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  console.log(' print database: mongo.js username password\n new entry: mongo.js username password name number')
  mongoose.connection.close()
}
