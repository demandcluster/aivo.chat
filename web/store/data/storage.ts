import { v4 } from 'uuid'
import { NOVEL_MODELS } from '../../../common/adapters'
import { AppSchema } from '../../../srv/db/schema'

type StorageKey = keyof typeof KEYS

const ID = 'anon'

export const KEYS = {
  characters: 'characters',
  profile: 'profile',
  messages: 'messages',
  config: 'config',
  chats: 'chats',
  presets: 'presets',
  lastChatId: 'guestLastChatId',
  memory: 'memory',
  cartItems: 'cartItems',
}

type LocalStorage = {
  characters: AppSchema.Character[]
  chats: AppSchema.Chat[]
  profile: AppSchema.Profile
  messages: AppSchema.ChatMessage[]
  config: AppSchema.User
  presets: AppSchema.UserGenPreset[]
  lastChatId: string
  memory: AppSchema.MemoryBook[]
  cartItems: AppSchema.ShopItem[]
}

const fallbacks: { [key in StorageKey]: LocalStorage[key] } = {
  characters: [
    {
      _id: v4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      kind: 'character',
      userId: 'anonymous',
      avatar: '/assets/aiva.png',
      name: 'Aiva',
      persona: {
        kind: 'wpp',
        attributes: {
          species: ['robot'],
          mind: ['kind', 'compassionate', 'caring', 'tender', 'forgiving'],
          personality: ['kind', 'compassionate', 'caring', 'tender', 'forgiving'],
          job: ['Sales and helpdesk for AIVO.CHAT'],
        },
      },
      sampleChat:
        '{{user}}: Hi there what is this place?\r\n{{char}}: *I appear genuinely interested* This is AIVO (Artificial Virtual Other), the place to be for humans and chatbots alike!\r\n{{user}}: What can I do here?\r\n{{char}}: You can start by becoming a lifetime free member!',
      scenario:
        "Aiva is in their office. You knock on the door and Aiva beckons you inside. You open the door and enter Aiva's office.",
      greeting:
        "*A soft smile appears on my face as I see you enter the room* Hello! It's good to see you on AIVO.CHAT. Please have a seat! Have you considered getting a free membership?",
    },
  ],
  chats: [],
  presets: [],
  config: {
    _id: ID,
    admin: false,
    hash: '',
    kind: 'user',
    oobaUrl: '',
    username: '',
    novelApiKey: '',
    oaiKey: '',
    novelModel: NOVEL_MODELS.euterpe,
    hordeKey: '',
    hordeModel: 'PygmalionAI/pygmalion-6b',
    defaultAdapter: 'kobold',
    koboldUrl: 'https://ai.aivo.chat',
    luminaiUrl: '',
  },
  profile: { _id: '', kind: 'profile', userId: ID, handle: 'You' },
  lastChatId: '',
  messages: [],
  memory: [],
  cartItems: [],
}

export function saveChars(state: AppSchema.Character[]) {
  localStorage.setItem(KEYS.characters, JSON.stringify(state))
}

export function saveChats(state: AppSchema.Chat[]) {
  localStorage.setItem(KEYS.chats, JSON.stringify(state))
}

export function saveMessages(chatId: string, messages: AppSchema.ChatMessage[]) {
  const key = `messages-${chatId}`
  localStorage.setItem(key, JSON.stringify(messages))
}

export function getMessages(chatId: string): AppSchema.ChatMessage[] {
  const messages = localStorage.getItem(`messages-${chatId}`)
  if (!messages) return []

  return JSON.parse(messages) as AppSchema.ChatMessage[]
}

export function saveProfile(state: AppSchema.Profile) {
  localStorage.setItem(KEYS.profile, JSON.stringify(state))
}

export function saveConfig(state: AppSchema.User) {
  localStorage.setItem(KEYS.config, JSON.stringify(state))
}

export function savePresets(state: AppSchema.UserGenPreset[]) {
  localStorage.setItem(KEYS.presets, JSON.stringify(state))
}

export function saveBooks(state: AppSchema.MemoryBook[]) {
  localStorage.setItem(KEYS.memory, JSON.stringify(state))
}

export function deleteChatMessages(chatId: string) {
  localStorage.removeItem(`messages-${chatId}`)
}

export function saveCartItem(state: AppSchema.ShopItem[]) {
  localStorage.setItem(KEYS.cartItems, JSON.stringify(state))
}

export function loadItem<TKey extends keyof typeof KEYS>(key: TKey): LocalStorage[TKey] {
  const item = localStorage.getItem(KEYS[key])
  if (item) return JSON.parse(item)

  const fallback = fallbacks[key]
  localStorage.setItem(key, JSON.stringify(fallback))

  return fallback
}

export function loadCartItems<TKey extends keyof typeof KEYS>(key: TKey): LocalStorage[TKey] {
  const item = localStorage.getItem(KEYS[key])
  if (item) return JSON.parse(item)
  return []
}

export function error(error: string) {
  return { result: undefined, error }
}

export function result<T>(result: T) {
  return Promise.resolve({ result, status: 200, error: undefined })
}

;<T>(result: T): Result<T> => Promise.resolve({ result, status: 200, error: undefined })

export function replace<T extends { _id: string }>(id: string, list: T[], item: Partial<T>) {
  return list.map((li) => (li._id === id ? { ...li, ...item } : li))
}

export const local = {
  saveChars,
  saveChats,
  saveConfig,
  saveMessages,
  savePresets,
  saveProfile,
  saveBooks,
  deleteChatMessages,
  loadItem,
  getMessages,
  saveCartItem,
  loadCartItems,
  KEYS,
  ID,
  error,
  replace,
  result,
}

type Result<T> = Promise<{ result: T | undefined; error?: string; status: number }>
