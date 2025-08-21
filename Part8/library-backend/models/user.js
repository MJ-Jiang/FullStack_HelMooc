import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  favouriteGenre: {
    type: String,   
    required: true
    }
})

const User = mongoose.model('User', schema)
export default User