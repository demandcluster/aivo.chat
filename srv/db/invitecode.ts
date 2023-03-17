import { v4 } from 'uuid'
import { db } from './client'
import { AppSchema } from './schema'

export async function checkInviteCode(
    _id:any){
  const char = await db('invitecode').findOne({ kind: 'invitecode', _id: _id,count: { $gt: 0 } })
  console.log('invite is ',char)
  console.log(_id)
  return char?.kind?true:false
}

export async function takeInviteCode( id: string) {
  const list = await db('invitecode').updateOne({ kind: 'invitecode', _id: id }, { $inc: { count: -1 } })
  return list
}


