import { v4 } from 'uuid'
import { db } from './client'
import { AppSchema } from './schema'
import { now } from './util'



export async function getMatch(userId: string, id: string) {
  const char = await db('character').findOne({ kind: 'character', _id: id,match:true })
  return char
}

export async function getMatches(userId: string) {
  const list = await db('character').find({ kind: 'character', match: true }).toArray()
  return list
}


export async function getMatchList(charIds: string[]) {
   
  const list = await db('character')
    .find({ _id: { $in: charIds }, kind: 'character' })
    .toArray()
  return list
}
