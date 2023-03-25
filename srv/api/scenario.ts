import { Router } from 'express'
import { assertValid } from 'frisker'
import { store } from '../db'
import { loggedIn, isAdmin } from './auth'
import { handle, StatusError } from './wrap'
import { handleUpload } from './upload'
import { PERSONA_FORMATS } from '../../common/adapters'
import {logger} from '../logger'
const router = Router()

const valid = {
  name: 'string',
  avatar: 'string?',
  scenario: 'string',
  greeting: 'string',
  description: 'string',
  xp: 'string',
  match: 'string',
  premium: 'string',
  sampleChat: 'string',
  persona: {
    kind: PERSONA_FORMATS,
    attributes: 'any',
  },
} as const

const createScenario = handle(async (req) => {
  const body = await handleUpload(req, { ...valid, persona: 'string' })
  const persona = JSON.parse(body.persona)

  assertValid(valid.persona, persona)

  const [file] = body.attachments
  const avatar = file ? file.filename : undefined

  const char = await store.characters.createCharacter(req.user?.userId!, {
    name: body.name,
    persona,
  
    premium: body.premium.toString()==="true",
    xp: 0,
    match: false,
    sampleChat: body.sampleChat,
    scenario: body.scenario,
    avatar,
    greeting: body.greeting,
  })

  return char
})



const getScenarios = handle(async ( req ) => {
  const charId = req.params?.charId || "false"
  const scenarios = await store.scenario.getScenarios(charId!)
  return { scenarios: scenarios }
})

const editScenario = handle(async (req) => {
  const id = req.params.id
  const body = await handleUpload(req, { ...valid, persona: 'string' })
  const persona = JSON.parse(body.persona)

  assertValid(valid.persona, persona)

  const [file] = body.attachments
  const avatar = file ? file.filename : undefined

  const char = await store.characters.updateCharacter(id, req.userId!, {
    name: body.name,
    persona,
    avatar,
    xp: Number(body.xp),
    premium: body.premium.toString()==="true",
    match: body.match.toString()==="true",
  //  summary: body.summary,
    greeting: body.greeting,
    scenario: body.scenario,
    sampleChat: body.sampleChat,
  })

  return char
})

const getCharacter = handle(async ({ userId, params }) => {
  const char = await store.characters.getCharacter(userId!, params.id)
  if (!char) {
    throw new StatusError('Character not found', 404)
  }
  return char
})



router.use(loggedIn)
//router.post('/', createScenario)
//router.post('/:id', addScenario)
router.get('/:charId', getScenarios)

export default router
