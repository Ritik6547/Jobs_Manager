const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const register = async (req, res) => {
    // this authentication is already done in User model
    // const { name, email, password } = req.body;
    // if (!name || !email || !password) {
    //     throw new BadRequestError('please provide name,email,password')
    // }

    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const tempUser = { name, email, password: hashedPassword }
    const user = await User.create({ ...tempUser })


    // const user = await User.create({ ...req.body })
    // const token = user.createJWT() --> from user model
    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    // console.log(token)
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email: email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
        return res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
    }
    else {
        throw new UnauthenticatedError('Invalid Credentials')
    }

}

module.exports = { register, login }