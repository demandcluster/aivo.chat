import * as chats from './chats'
import * as characters from './characters'
import * as users from './user'
import * as invites from './invite'
import * as admin from './admin'
import * as matches from './matches'
export { db } from './client'

export const store = {
  chats,
  characters,
  users,
  matches,
  invites,
  admin,
}
