import { WebSocketServer } from 'ws'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'

import Message from '../models/message.model.js'
import Chat from '../models/chat.model.js'

const UserToSocketMap = new Map()
const SocketToUserMap = new Map()

const connection = new Redis({
  host: 'redis-14076.c99.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 14076,
  password: process.env.REDIS_PASS,
  maxRetriesPerRequest: null,
})

const messageQueue = new Queue('saveMessageInDB', { connection })

const worker = new Worker(
  'saveMessageInDB',
  async (job) => {
    console.log(job.data)
    let { sender, content, receiver } = job.data
    console.log(job.data)

    sender = new mongoose.Types.ObjectId(sender)
    receiver = new mongoose.Types.ObjectId(receiver)

    const message = new Message({
      sender: sender,
      content: content,
    })
    await message.save()

    const chat = await Chat.findOne({
      recipients: {
        $all: [sender, receiver],
      },
    })

    console.log(chat)

    if (!chat) {
      console.log('creating new chat')

      const newChat = new Chat({
        recipients: [sender, receiver],
        isGroupChat: false,
        messages: [message],
        lastMessage: message,
      })

      await newChat.save()
    } else {
      chat.messages = [...chat.messages, message]
      chat.lastMessage = message
      chat.save()
    }
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`)
})

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})
export function createSocketServer(server) {
  const wss = new WebSocketServer({ server: server })

  console.log('Server connection')

  wss.on('connection', (ws, request) => {
    const cookies = cookie.parse(request.headers.cookie || '')

    const decodedToken = jwt.verify(
      cookies.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )

    if (!decodedToken) {
      console.log('invalid token')
      return
    }
    console.log('connected user')

    UserToSocketMap.set(decodedToken._id, ws)
    SocketToUserMap.set(ws, decodedToken._id)

    ws.on('message', async function message(data) {
      try {
        data = JSON.parse(data.toString())

        const parsedData = JSON.parse(data.jsonMessage)
        console.log(parsedData)

        const receiverSocket = UserToSocketMap.get(parsedData.receiver)
        console.log('receiverf sickert ', typeof receiverSocket)
        console.log(receiverSocket)

        console.log(`sending ${parsedData.content} to ${receiverSocket}`)

        const sender = SocketToUserMap.get(ws)
        if (receiverSocket) {
          const message = { content: parsedData.content, sender: sender }
          receiverSocket.send(JSON.stringify(message), { binary: false })
        }

        messageQueue.add('saveMessageInDB', {
          sender: sender,
          content: parsedData.content,
          receiver: parsedData.receiver,
        })
      } catch (error) {
        console.log('lol check request', error)
      }
    })
  })
}
