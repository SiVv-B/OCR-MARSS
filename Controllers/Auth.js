const crypto = require ("crypto")
const User = require('../Models/User')
const ErrorResponse = require('../Utils/errorResponse')
const sendEmail = require ("../Utils/SendEmails")

exports.register = async (req, res, next) => {
  //to extract data from the body:
  const { username, email, password } = req.body
  try {
    //Create a user useing the User model
    const user = await User.create({
      username,
      email,
      password,
    })
    //generate a token from the function sendToken
    sendToken(user, 201, res)
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  ///get data from the body
  const { email, password } = req.body
  //if there is no email or password tiped
  if (!email || !password) {
    return next(
      new ErrorResponse('Veuillez inserer une adresse mail et un mot de pass', 400),
    )
  } //else
  try {
    //find a user by its email and select the pass and retun its password
    const user = await User.findOne({ email }).select('+password')
    //if the user is not found
    if (!user) {
      return next(new ErrorResponse('Aucun email n\'a pu être envoyé', 401))
    }
    //compare the tiped password with the password of the data
    const isMatch = await user.matchPasswords(password)
    if (!isMatch) {
      return next(new ErrorResponse('Le mot de passe est incorrect', 401))
    }

    //generate token
    sendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

exports.forgotPassword = async (req, res, next) => {
  //get email from the body
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    console.log(user, "forgot password")
    //check if the user exists in the DataBase
    if (!user) {
      return next(new ErrorResponse('L\'email n\'a pas pu être envoyé', 404))
    }
// Reset Token Gen and add to database hashed (private) version of token    
const resetToken = user.getResetPasswordToken()
    //save the token in database
    await user.save()
//Link to email to the client (in front end)
    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`
    //the sent message to the client:
    const message = `
    <h1>Vous avez demandé de changer votre mot de pass</h1>
      <p>Veuillez cliquer sur le lien ci-dessous:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`

    //The method that allows to sen the email
    try {
      //create an email sender //need package nodemailer and signup at SendGrid.com
       await sendEmail({
        to: user.email,
        subject: "Modification du mot de pass",
        text: message,
      })

      res.status(200).json({ success: true, data: "Email envoyé" })

    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()
      return next(new ErrorResponse("L\'email n\'a pas pu être envoyé",500))
    }
  } catch (error) {
    next(error)
  }
}



  exports.resetPassword = async (req, res, next) => {
    // Compare token in URL params to hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex")
  
    try {
      //search for a user who has the same password
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      })
  
      if (!user) {
        return next(new ErrorResponse("Invalid Token", 400))
      }
  //Once we find the user, we send the new password, the token and the expiration date
      user.password = req.body.password
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
  
      await user.save()
  
      res.status(201).json({
        success: true,
        data: "Le mot de pass a été modifié avec succès",
      })
    } catch (err) {
      console.log(err,"resetPassword error")
      next(err)
    }
}

//a methode that generates token for us
//Use this method in every controllers that uses token
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken()
  res.status(statusCode).json({ sucess: true, token })
}
