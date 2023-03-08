import { AppSchema } from '../../srv/db/schema'
import { api } from './api'
import { createStore } from './create'
import { toastStore } from './toasts'

type Matchesstate = {
  Matches: {
    loaded: boolean
    list: AppSchema.Match[]
  }
}

export type NewMatch = {
  name: string
  greeting: string
  scenario: string
  sampleChat: string
  avatar?: File
  persona: AppSchema.MatchPersona
}

export const matchStore = createStore<Matchesstate>('Match', {
  Matches: { loaded: false, list: [] },
})((get, set) => {
  return {
    logout() {
      return { Matches: { loaded: false, list: [] } }
    },
    getMatches: async () => {
      const res = await api.get('/match')
      if (res.error) toastStore.error('Failed to retrieve Matches')
      else {
       
        return { characters: { list: res.result.characters, loaded: true } }
      }
    },
    createMatch: async (_, char: NewMatch, onSuccess?: () => void) => {
      const form = new FormData()
      form.append('name', char.name)
      form.append('greeting', char.greeting)
      form.append('scenario', char.scenario)
      form.append('persona', JSON.stringify(char.persona))
      form.append('sampleChat', char.sampleChat)
      if (char.avatar) {
        form.append('avatar', char.avatar)
      }

      const res = await api.upload(`/Match`, form)

      if (res.error) toastStore.error(`Failed to create Match: ${res.error}`)
      if (res.result) {
        toastStore.success(`Successfully created Match`)
        Matchestore.getMatches()
        onSuccess?.()
      }
    },
    editMatch: async (_, MatchId: string, char: NewMatch, onSuccess?: () => void) => {
      const form = new FormData()
      form.append('name', char.name)
      form.append('greeting', char.greeting)
      form.append('scenario', char.scenario)
      form.append('persona', JSON.stringify(char.persona))
      form.append('sampleChat', char.sampleChat)
      if (char.avatar) {
        form.append('avatar', char.avatar)
      }

      const res = await api.upload(`/Match/${MatchId}`, form)

      if (res.error) toastStore.error(`Failed to create Match: ${res.error}`)
      if (res.result) {
        toastStore.success(`Successfully updated Match`)
        Matchestore.getMatches()
        onSuccess?.()
      }
    },
    deleteMatch: async ({ Matches: { list } }, charId: string, onSuccess?: () => void) => {
      const res = await api.method('delete', `/Match/${charId}`)
      if (res.error) return toastStore.error(`Failed to delete Match`)
      if (res.result) {
        const next = list.filter((char) => char._id !== charId)
        toastStore.success('Successfully deleted Match')
        onSuccess?.()
        return {
          Matches: { loaded: true, list: next },
        }
      }
    },
  }
})
