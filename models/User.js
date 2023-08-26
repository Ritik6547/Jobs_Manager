const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name must be provided'],
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,

    }
})

// mongoose middleware
// UserSchema.pre('save', async function () {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

// })

// UserSchema.methods.createJWT = function () {
//     return jwt.sign({ userId: this._id, name: this.name }, 'jwtSecret', { expiresIn: '30d' })
// }

// UserSchema.methods.comparePass = async function (userPassword) {
//     const isMatch = await bcrypt.compare(userPassword, this.password)
//     console.log(isMatch)
//     return isMatch
// }

module.exports = mongoose.model('User', UserSchema)