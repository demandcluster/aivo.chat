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

    const now = new Date().getTime();
    const nextTime:number = Number(now) + 60000
    const users = await db('user').find({ kind: 'user', nextCredits: { $lte: now } ,premium: false, credits: { $lt: 200 } }).toArray();
    const premiumUsers = await db('user').find({ kind: 'user', nextCredits: { $lte: now } , credits: { $lt: 1000 }, premium: true }).toArray();
    
    for (const user of users) {
      const lastCredits = user.nextCredits||now;
      const diff = now - lastCredits;
      const creditsToAdd = Math.floor(diff / 60000) * 5;
      const updatedCredits = Math.min(user.credits + creditsToAdd, 200);
      await db('user').updateOne({ _id: user._id, credits: { $lt: 200 } }, { $inc: { credits: updatedCredits - user.credits }, $set: { nextCredits: nextTime } });
    }
    for (const user of premiumUsers) {
      const lastCredits = user.nextCredits||now;
      const diff = now - lastCredits;
      const creditsToAdd = Math.floor(diff / 60000) * 10;
      const updatedCredits = Math.min(user.credits + creditsToAdd, 1000);
      await db('user').updateOne({ _id: user._id, credits: { $lt: 1000 } }, { $inc: { credits: updatedCredits - user.credits }, $set: { nextCredits: nextTime } });
    }
}