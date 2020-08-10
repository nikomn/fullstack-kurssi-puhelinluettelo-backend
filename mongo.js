const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length == 4 || process.argv.length > 5) {
    console.log('Argument error: Wrong number of arguments. ' 
                + 'Remember to use quotations if name or number has spaces')
    process.exit(1)
  }

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.08swj.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<5) {

    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })

} else {

    const person = new Person({
        name: `${name}`,
        number: `${number}`
      })
      
      person.save().then(response => {
        console.log(`Added ${name} with number ${number} to phonebook database!!`)
        mongoose.connection.close()
      })

}



