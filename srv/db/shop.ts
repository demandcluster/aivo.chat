
import { db } from './client'
import { AppSchema } from './schema'



export async function getItems() {
  const items = await db('shop').find({ kind: 'shop' }).toArray()
  
  return items||[]
}

