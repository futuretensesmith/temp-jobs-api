const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// *** above in the bcrypt package there is a compare function that will compare hashed passwords ***
// below in emal the unique property checks for a unique email address. If there is a duplicate it will provide an error message
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email address.',],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide correct password'],
        minLength: 6,
        // maxLength: 12,
    },
})
// Don't need to use next() below because we are using async *** which is a function that returns a promise ***
// creating a temporary user object and hashing password with bcryptjs
// use function keyword instead of arrow function so that  -- this -- keyword will point to our document
// below are instance method of the UserSchema
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
}
// this function is looking for one argument -- the password that is coming with the request
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

// UserSchema.pre('save', async function (next) {
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })

module.exports = mongoose.model('User', UserSchema)