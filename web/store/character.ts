import { AppSchema } from '../../srv/db/schema'
import { createStore } from './create'
import { data } from './data'
import { toastStore } from './toasts'
import { userStore } from './user'

type CharacterState = {
  characters: {
    loaded: boolean
    list: AppSchema.Character[]
  }
}

export type NewCharacter = {
  name: string
  greeting: string
  scenario: string
  xp: number
  match: boolean
  premium: boolean
  sampleChat: string
  avatar?: File
  persona: AppSchema.CharacterPersona
}

export const characterStore = createStore<CharacterState>('character', {
  characters: { loaded: false, list: [] },
})((get, set) => {
  userStore.subscribe((curr, prev) => {
    if (!curr.loggedIn && prev.loggedIn) characterStore.logout()
  })

  return {
    logout() {
      return { characters: { loaded: false, list: [] } }
    },
    getCharacters: async () => {
      const res = await data.chars.getCharacters()
      if (res.error) toastStore.error('Failed to retrieve characters')
      if (res.result) {
        return { characters: { list: res.result.characters, loaded: true } }
      }
    },
    createCharacter: async (_, char: NewCharacter, onSuccess?: () => void) => {
      const form = new FormData()
      form.append('name', char.name)
      form.append('greeting', char.greeting)
      form.append('scenario', char.scenario)
      form.append('xp',toStchar.xp)
      form.append('premium',char.premium)
      form.append('match',char.match)
      form.append('summary',char.summary)
      form.append('persona', JSON.stringify(char.persona))
      form.append('sampleChat', char.sampleChat)
      if (char.avatar) {
        form.append('avatar', char.avatar)
      }

      const res = await api.upload(`/character`, form)

      const res = await data.chars.createCharacter(char)
      if (res.error) toastStore.error(`Failed to create character: ${res.error}`)
      if (res.result) {
        toastStore.success(`Successfully created character`)
        characterStore.getCharacters()
        onSuccess?.()
      }
    },
    editCharacter: async (_, characterId: string, char: NewCharacter, onSuccess?: () => void) => {
      const res = await data.chars.editChracter(characterId, char)    

      if (res.error) toastStore.error(`Failed to create character: ${res.error}`)
      if (res.result) {
        toastStore.success(`Successfully updated character`)
        characterStore.getCharacters()
        onSuccess?.()
      }
    },
    deleteCharacter: async ({ characters: { list } }, charId: string, onSuccess?: () => void) => {
      const res = await data.chars.deleteCharacter(charId)
      if (res.error) return toastStore.error(`Failed to delete character`)
      if (res.result) {
        const next = list.filter((char) => char._id !== charId)
        toastStore.success('Successfully deleted character')
        onSuccess?.()
        return {
          characters: { loaded: true, list: next },
        }
      }
    },
  }
})
