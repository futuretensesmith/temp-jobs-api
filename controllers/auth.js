const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')
// don't have to put ../errors/index.js because when we point at 
// the errors folder it defaults to index.js since there is an index file
const { BadRequestError, UnauthenticatedError } = require('../errors')



const register = async (req, res) => {
    // create user then create and sign token
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide valid email address and password.')
    }
    const user = await User.findOne({ email })

    if (!user) {
        throw new UnauthenticatedError('Invalid credentials.')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials.')
    }
    // compare password
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login,
}