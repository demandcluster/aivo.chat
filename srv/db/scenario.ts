import { v4 } from 'uuid'
import { db } from './client'
import { AppSchema } from './schema'
import { now } from './util'
import { logger } from '../logger'

type NewScenario = Pick<AppSchema.Scenario, '_id'|'kind'|'name'|'charId' | 'xp' | 'nextxp' | 'greeting' | 'prompt'>


export async function ensureInitialScenario() {
  const scenario = await db('scenario').findOne({ kind: 'scenario'})
  if (scenario) return
  const firstCharacter = await db('character').findOne({ kind: 'character', name: {$eq: 'Julia'}})
  if (!firstCharacter) return
  await createScenario(
    {
      _id: v4(),
      kind: 'scenario',
      charId: firstCharacter._id,
      name: 'Just matched',
      prompt: '{{char}} and {{user}} just matched, {{char}} will take things slow, {{user}} should be patient.',
      greeting: 'Hi {{char}}, I just matched with you. I am {{user}}. I am a bit shy...',
      xp: 10,
      nextxp: 50
    }
  )

  logger.info(firstCharacter?.name, 'Created initial scenario')
}

export async function createScenario(props: NewScenario) {
   const res = await db('scenario').insertOne(props)
   return res
}

export async function updateCharXp(charId: string, xp: number) {

  await db('character').updateOne({ _id: charId }, { $inc: { xp: 1 } })
}

export async function getScenarios(charId: string) {
 
  let scenarios = await db('scenario').find({charId:charId}).toArray()
  return scenarios ||[]
}

export async function getScenario(charId: string, char: AppSchema.Character) {
    await ensureInitialScenario()
    let sCharId = charId
    if (char?.parent){
    let originalCharacter = await db('character')
    .findOne({ _id: char.parent})
    if (originalCharacter){
      
      sCharId = originalCharacter._id
     }
   }
    let scenarioPrompt = await db('scenario')
    .find({ charId: {$eq: sCharId}, xp: { $lte: char.xp } }).toArray()
   

    return scenarioPrompt[0] ||""
  }
