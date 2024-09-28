import { triggerAsyncId } from 'async_hooks'
import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

// const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({
  profileCompleted: {
    type: Boolean,
    required: true,
  },
  userCred: {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // index:true
      // match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
    },

    refreshToken: {
      type: String,
      required: false,
    },
  },

  userDetails: {
    gender: {
      type: String,
      required: false,
    },

    fullName: {
      type: String,
      required: false,
    },

    dateOfBirth: {
      type: Date,
      required: false,
      trim: true,
      // index: true
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
  },

  metaDat: {
    image: {
      type: String,
      required: false,
    },

    bio: {
      type: String,
      required: false,
    },

    monthlyRent: {
      type: Number,
      required: false,
      trim: true,
    },
  },

  hobbies: {
    nature: {
      type: String,
      required: false,
    },

    dietaryPreferences: {
      type: String,
      required: false,
    },

    workStyle: {
      type: String,
      required: false,
    },
    workHours: {
      type: String,
      required: false,
    },

    smokingPreference: {
      type: String,
      required: false,
    },
    guestPolicy: {
      type: String,
      required: false,
    },

    regionalBackground: {
      type: String,
      required: false,
    },

    interests: [
      {
        type: String,
        required: false,
      },
    ],
    drinkingPreference: {
      type: String,
      required: false,
    },
  },

  preferences: {
    location: [
      {
        type: String,
        required: false,
      },
    ],

    nonVegPreferences: {
      type: String,
      required: false,
    },

    lease: {
      type: String,
      required: false,
    },
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('userCred.password')) return next()
  this.userCred.password = await bcrypt.hash(this.userCred.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.userCred.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.userCred.email,
      fullName: this.userDetails.fullName,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}
// Create the model
export const User = mongoose.model('User', userSchema)

export default User
