import { AIAdapter, ChatAdapter, PersonaFormat } from '../../common/adapters'
import { GenerationPreset } from '../../common/presets'

export namespace AppSchema {
  export interface Token {
    userId: string
    username: string
    admin: boolean
    iat: number
    exp: number
  }

  export interface Profile {
    _id: string
    kind: 'profile'
    userId: string
    handle: string
    avatar?: string
    persona?: Persona
  }

  export interface User {
    _id: string
    kind: 'user'
    username: string
    hash: string
    admin: boolean

    novelApiKey: string
    novelModel: string
    novelVerified?: boolean

    koboldUrl: string
    luminaiUrl: string
    oobaUrl: string
    premium: boolean
    credits: number
    premiumUntil?: number
    nextCredits?: number
    oaiKey: string
    oaiKeySet?: boolean

    hordeKey: string
    hordeModel: string
    hordeName?: string
    hordeWorkers?: string[]

    scaleUrl?: string
    scaleApiKey?: string
    scaleApiKeySet?: boolean

    defaultAdapter: AIAdapter
    defaultPresets?: { [key in AIAdapter]?: string }
  }

  export interface Chat {
    _id: string
    kind: 'chat'
    userId: string
    memoryId?: string

    memberIds: string[]

    name: string
    characterId: string
    messageCount: number
    adapter?: ChatAdapter

    greeting: string
    scenario: string
    sampleChat: string
    overrides: Persona

    createdAt: string
    updatedAt: string

    genPreset?: GenerationPreset | string
    genSettings?: Omit<GenSettings, 'name'>
  }

  export interface ChatMember {
    _id: string
    kind: 'chat-member'
    chatId: string
    userId: string
    createdAt: string
  }

  export interface ChatMessage {
    _id: string
    kind: 'chat-message'
    chatId: string
    msg: string
    characterId?: string
    userId?: string

    // Only chat owners can rate messages for now
    rating?: 'y' | 'n' | 'none'
    adapter?: string

    createdAt: string
    updatedAt: string
    first?: boolean
  }

  /** Description of the character or user */
  export type Persona =
    | {
        kind: PersonaFormat
        attributes: { [key: string]: string[] }
      }
    | { kind: 'text'; attributes: { text: [string] } }

  export interface Character {
    _id: string
    kind: 'character'
    userId: string
    name: string
    description?: string
    persona: Persona
    greeting: string
    scenario: string
    sampleChat: string
    match: boolean
    xp: number
    premium: boolean
    parent?: string
    avatar?: string

    createdAt: string
    updatedAt: string
  }

  export interface ChatInvite {
    _id: string
    kind: 'chat-invite'
    byUserId: string
    invitedId: string
    chatId: string
    createdAt: string
    characterId: string
    state: 'pending' | 'rejected' | 'accepted'
  }

  export interface ChatLock {
    kind: 'chat-lock'

    /** Chat ID, Unique */
    chatLock: string

    /** Time to live in seconds. Locks older than this are invalid */
    ttl: number

    /** ISO string - We will ignore locks of a particular age */
    obtained: string

    /** We return this top the caller requesting a lock. It is used to ensure the lock is valid during a transaction. */
    lockId: string
  }

  export interface UserGenPreset extends GenSettings {
    _id: string
    kind: 'gen-setting'
    userId: string
  }

  export interface GenSettings {
    name: string
    temp: number
    maxTokens: number
    maxContextLength?: number
    repetitionPenalty: number
    repetitionPenaltyRange: number
    repetitionPenaltySlope: number
    typicalP: number
    topP: number
    topK: number
    topA: number
    tailFreeSampling: number
    order?: number[]

    gaslight?: string
    useGaslight?: boolean

    frequencyPenalty?: number
    presencePenalty?: number
    oaiModel?: string

    memoryDepth?: number
    memoryContextLimit?: number
    memoryReverseWeight?: boolean
    src?: string
  }

  export interface AppConfig {
    adapters: AIAdapter[]
    version: string
    canAuth: boolean
  }

  export interface MemoryBook {
    kind: 'memory'
    _id: string
    name: string
    description?: string
    userId: string
    entries: MemoryEntry[]
  }

  export interface MemoryEntry {
    name: string

    /** The text injected into the prompt */
    entry: string

    /** Keywords that trigger the entry to be injected */
    keywords: string[]

    /** When choosing which memories to discard, lowest priority will be discarded first */
    priority: number

    /** When determining what order to render the memories, the highest will be at the bottom  */
    weight: number

    enabled: boolean
  }

  export interface ShopOrder{
    _id: string
    kind: 'order'
    order?: number
    items: ShopItem[]
    total: number
    userId: string
    name?: string
    createdAt: string
    updatedAt?: string
    status: 'pending' | 'failed' | 'cancelled' | 'success' | 'hold' | 'completed'
    paymentId?: string
  }

  export interface OrderCount{
    _id: string
    kind: 'order-count'
    sequence_value: number
  }
  export interface Scenario{
    _id: string
    kind: 'scenario'
    charId: string
    name: string
    prompt: string
    xp: number
    greeting: string
  }

  export interface InviteCode{
    _id: string
    kind: 'invitecode'
    count: number
  }

  export interface ShopItem {
    _id: string
    kind: 'shop'
    name: string
    price: number
    credits: number
    premium: boolean
    days: number
    incart: false
  }
}

export type Doc<T extends AllDoc['kind'] = AllDoc['kind']> = Extract<AllDoc, { kind: T }>

export type AllDoc =
  | AppSchema.Chat
  | AppSchema.ChatMessage
  | AppSchema.Character
  | AppSchema.User
  | AppSchema.Profile 
  | AppSchema.ChatLock
  | AppSchema.ChatMember
  | AppSchema.ChatInvite
  | AppSchema.UserGenPreset
  | AppSchema.Scenario 
  | AppSchema.InviteCode
  | AppSchema.MemoryBook
  | AppSchema.ShopItem
  | AppSchema.ShopOrder
  | AppSchema.OrderCount

export const defaultGenPresets: AppSchema.GenSettings[] = []

export type NewBook = Omit<AppSchema.MemoryBook, 'userId' | '_id' | 'kind'>
