import { errors, StatusError } from '../api/wrap'
import { getChat } from './chats'
import { db } from './client'

import { AppSchema } from './schema'

export async function updateCredits(userId: string, amount: number) {
  const user = await db('user').findOne({ kind: "user", _id: userId })
  if (!user) {
    throw errors.NotFound
  }
  const credits = user.credits + amount
  if (credits < 0) {
    throw errors.BadRequest
  }

  await db('user').updateOne({ kind: 'user', _id: userId }, { $set: { credits } }).catch((err) => {
    throw new StatusError("Database error", 500)
   })
   return { credits }
}

export async function getFreeCredits() {
    const now= new Date().getTime()
    const nextTime:number = Number(now) + 60000

    await db('user').updateMany({ kind: 'user', premium: { $eq: true} ,nextCredits: { $lt: Number(now) }, credits: { $lt: 1000 } }, { $inc: { credits: + 10 }, $set: { nextCredits: nextTime } })
    await db('user').updateMany({ kind: 'user', nextCredits: { $lt: Number(now) }, credits: { $lt: 200 } }, { $inc: { credits: + 5 }, $set: { nextCredits: nextTime } })
   
}