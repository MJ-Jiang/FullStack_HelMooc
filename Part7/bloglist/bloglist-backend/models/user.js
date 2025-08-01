const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
        },
    ],
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    name: String,
    passwordHash: String,
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
