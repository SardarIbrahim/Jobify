import { StatusCodes } from 'http-status-codes'

import User from '../models/User.js'
import { BadRequestError, unAuthenticatedError } from '../errors/index.js'

// register the user
const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all credentials')
  }

  // check for duplicate email
  const isUser = await User.findOne({ email })
  if (isUser) {
    throw new BadRequestError('Email already in use')
  }

  const user = await User.create({ name, email, password })

  const token = await user.createJWT()

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastname: user.lastName,
    },
    token,
    location: user.location,
  })
}
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('please provide all credentials')
  }

  // check for duplicate email
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new unAuthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new unAuthenticatedError('Invalid Credentials')
  }

  const token = await user.createJWT()

  // not sending the password back so:
  user.password = undefined

  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  })
}

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body

  if (!name || !email || !lastName || !location) {
    throw new BadRequestError('please provide all credentials')
  }

  const user = await User.findOne({ _id: req.user.userId })

  ;(user.email = email), (user.name = name)
  user.lastName = lastName
  user.location = location

  await user.save()

  const token = await user.createJWT()
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  })
}

export { register, login, updateUser }
