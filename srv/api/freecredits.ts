import { store } from '../db'
import { loggedIn } from './auth'
import { logger } from '../logger'
import { isConnected } from '../db/client'

logger.error('included')
 updateFreeCredits()

setInterval(updateFreeCredits, 1000 * 60 );

export default function updateFreeCredits() {
 if(isConnected()){
       console.log('credit update')
  const credits = store.credits.getFreeCredits()
  return credits
 }
 return 0
}