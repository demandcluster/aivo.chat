import { db } from './client'
import { encryptPassword } from './util'

export async function getUsers() {
  const list = await db('user').find({ kind: 'user' }).toArray()
  return list
}

export async function changePassword(opts: { username: string; password: string }) {
  const hash = await encryptPassword(opts.password)
  await db('user').updateOne({ kind: 'user', username: opts.username }, { $set: { hash } })
  return true
}

export async function getUserInfo(userId: string) {
  const profile = await db('profile').findOne({ userId })
  const user = await db('user').findOne({ _id: userId })
  const chats = await db('chat').countDocuments({ userId })
  const characters = await db('character').countDocuments({ userId })
  const premiumInfo = {credits: user?.credits||0, premium: user?.premium||false, premiumUntil: user?.premiumUntil||0}
  return { userId, chats, characters, membership: premiumInfo, handle: profile?.handle, avatar: profile?.avatar }
}
