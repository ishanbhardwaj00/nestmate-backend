import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    content: { required: true, type: String },
    readBy: [
      {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Message', messageSchema)
