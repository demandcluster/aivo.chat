import * as chats from './chats'
import * as characters from './characters'
import * as users from './user'
import * as invites from './invite'
import * as admin from './admin'
import * as matches from './matches'
import * as credits from './credits'
import * as scenario from './scenario'
export { db } from './client'

export const store = {
  chats,
  characters,
  credits,
  users,
  matches,
  invites,
  admin,
  scenario
}
