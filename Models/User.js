const crypto = require("crypto")
//Need to install and import mongoose to use the schema
const mongoose = require('mongoose')
//to hash password
const bcrypt = require('bcryptjs')
//to generate tokens
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Veuillez inserer un nom d\'identifiant'],
  },
  email: {
    type: String,
    required: [true, 'Veuillez inserer un email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Cette adresse email n\'est pas valide, Veuillez ajouter une autre adresse email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Veuillez ajouter un mot de pass'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

//create a middleware to crypt/hash the password before to save the user
UserSchema.pre('save', async function (next) {
  //if the password in the data is not the same as the typed password
  //then save the current password and go to the next function
  //else hash the password
  if (!this.isModified('password')) {
    next()
  }

  //***to hash a password: */
  //generate salt to secure the password
  const salt = await bcrypt.genSalt(10)
  //the tiped password will be equal to the hashed password:
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

///Create a method that allows to compare a tiped password with the password of the data
//this method will be user in auth controllers
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

//Generate a token and apply it in controllers
//install jsonwebtoken
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

//Crypt a reset password //need package crypto
UserSchema.methods.getResetPasswordToken = function () {
  //reset token
  const resetToken = crypto.randomBytes(20).toString('hex')
  //hash this reset token
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    this.resetPasswordExpire = Date.now() + 10 * (60*1000)
  return resetToken
}

//Create the User model
const User = mongoose.model('User', UserSchema)

//we export the User model
module.exports = User

//We use the models in the controllers
