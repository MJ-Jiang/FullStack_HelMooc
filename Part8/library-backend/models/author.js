const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Author name is required'],
    unique: true,
    minlength: [4,'Author name must be at least 3 characters']
  },
  born: {
    type: Number,
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Author', schema)