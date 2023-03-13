import { assertValid } from 'frisker'
import { PERSONA_FORMATS } from '../../../common/adapters'
import { store } from '../../db'
import { handle } from '../wrap'
import {AppSchema} from '../../db/schema'

export const createChat = handle(async ({ body, user }) => {
  assertValid(
    {
      characterId: 'string',
      name: 'string',
      greeting: 'string',
      scenario: 'string',
      sampleChat: 'string',
      overrides: {
        kind: PERSONA_FORMATS,
        attributes: 'any',
      },
    },
    body
  )
  
  const char = await store.characters.getCharacter(user?.userId||"",body.characterId||"")
  //const myChar:AppSchema.Character = char
  if (char){
  const scene= await store.scenario.getScenario(body.characterId,char)
  if(scene ){
    body.greeting = scene.greeting
    body.scenario = scene.prompt 
  }}
  console.log('char at createChat',char)
  const chat = await store.chats.create(body.characterId, { ...body, userId: user?.userId! })
  return chat
})
