const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    // check header and bearer. notice space in string check of 'Bearer ' it matters because below we split the string 
    // which allows us to read the token after Bearer
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid.')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach the user to the jobs routes
        // Alternative code to below req.user = { userId: payload.userId, name: payload.name }
        // const user = User.findById(payload.id).select('-password')
        // req.user = user
        req.user = { userId: payload.userId, name: payload.name }
        next()
    } catch (error) {
        console.log(error)
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth