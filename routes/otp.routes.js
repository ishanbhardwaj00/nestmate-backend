import express from 'express'
import nodemailer from 'nodemailer'
import OTP from '../models/otp.model.js'
import User from '../models/users.model.js'
import {
  generateOTP,
  generateOTPExpiry,
  updateOTPForUser,
  isOtpValid,
} from '../utils/otp_gen.js'

const router = express.Router()

// Generate OTP Route
router.post('/generateOtp', async (req, res) => {
  const { email } = req.body

  try {
    const userExists = await User.findOne({ 'userCred.email': email })

    if (userExists) {
      return res.status(200).json({
        success: false,
        message: 'User already signed up',
      })
    }
    const otp = generateOTP()
    const otpExpiry = generateOTPExpiry()

    // Update or insert the OTP and its expiry in the database
    await updateOTPForUser(email, otp, otpExpiry)

    // Set up the email transporter using nodemailer
    const transporter = nodemailer.createTransport({
      secure: true,
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'arjunvir.m@gmail.com',
        pass: 'jevewwnlkhlnkxnz',
      },
    })

    // Send the email with the OTP
    await transporter.sendMail({
      to: email,
      subject: 'Hey, verify your account on HOMIGO',
      html: `<p>The verification code is <strong>${otp}</strong></p>`,
    })

    console.log('Email is sent')
    res.status(200).send({
      success: true,
      profileCompleted: null,
      message: 'OTP sent to your email!',
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    res.status(500).send({ success: false, message: 'Error sending OTP' })
  }
})

// Verify OTP Route
router.post('/verifyOtp', async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp)
    return res.json({
      success: false,
      message: 'Some error occurred. Please try refreshing.',
    })

  try {
    const isValid = await isOtpValid(email, otp)
    if (isValid) {
      await OTP.deleteOne({ email })
      res
        .status(200)
        .json({ success: true, message: 'OTP verified successfully!' })
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Invalid OTP or OTP expired' })
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({
      success: false,
      message: 'Server error occurred while verifying OTP',
    })
  }
})

export default router
