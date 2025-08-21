
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

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
const Author = mongoose.model('Author', schema)
export default Author
