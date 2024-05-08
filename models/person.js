const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

const personSchema = new mongoose.Schema({
  name: String,
  number: {
    type: String,
    minlength: 9,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d{5,}$/.test(v);
      },
      message: props => `${props.value} is not a valid number`
    },
    required: true
  }
})

// Muunna MongoDB:n olio-id mjonoksi ja poista versionumero
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)