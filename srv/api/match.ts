import { Router } from 'express'
import { assertValid } from 'frisker'
import { store } from '../db'
import { loggedIn } from './auth'
import { handle, StatusError } from './wrap'
import { handleUpload } from './upload'
import { PERSONA_FORMATS } from '../../common/adapters'

const router = Router()

const valid = {
  name: 'string',
  avatar: 'string?',
  scenario: 'string',
  greeting: 'string',
  sampleChat: 'string',
  match: "boolean",
  xp: "number",
  premium: "boolean",
  summary: "string", 
  persona: {
    kind: PERSONA_FORMATS,
    attributes: 'any',
  },
} as const

const createMatch = handle(async (req) => {
  const body = await handleUpload(req, { ...valid, persona: 'string' })
  const persona = JSON.parse(body.persona)

  assertValid(valid.persona, persona)

  const [file] = body.attachments
  const avatar = file ? file.filename : undefined

  const char = await store.characters.createCharacter(req.user?.userId!, {
    name: body.name,
    persona,
    summary: "",
    xp: 0,
    premium: false,
    match: true,
    sampleChat: body.sampleChat,
    scenario: body.scenario,
    avatar,
    greeting: body.greeting,
  })

  return char
})

const getMatches = handle(async ({ userId }) => {
  const chars = await store.matches.getMatches(userId!)
  console.log(chars,'-----------------')
  return { characters: chars }
})

// const editMatch = handle(async (req) => {
//   const id = req.params.id
//   const body = await handleUpload(req, { ...valid, persona: 'string' })
//   const persona = JSON.parse(body.persona)

//   assertValid(valid.persona, persona)

//   const [file] = body.attachments
//   const avatar = file ? file.filename : undefined

//   const char = await store.characters.updateMatch(id, req.userId!, {
//     name: body.name,
//     persona,
//     avatar,
//     greeting: body.greeting,
//     scenario: body.scenario,
//     sampleChat: body.sampleChat,
//   })

//   return char
// })

const getMatch = handle(async ( id ) => {
  const char = await store.matches.getMatch(id,{})

  if (!char) {
    throw new StatusError('Character not found', 404)
  }
  return {characters:char}
})

// const deleteMatch = handle(async ({ userId, params }) => {
//   const id = params.id
//   await store.characters.deleteMatch(userId!, id)
//   return { success: true }
// })

router.use(loggedIn)
//router.post('/', createMatch)
router.get('/', getMatches)
//router.post('/:id', editMatch)
router.get('/:id', getMatch)
//router.delete('/:id', deleteMatch)

export default router
