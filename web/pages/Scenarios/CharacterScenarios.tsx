import { Component, createEffect, createMemo, createSignal, For, Show } from 'solid-js'
import Button from '../../shared/Button'
import PageHeader from '../../shared/PageHeader'
import { Copy, Download, Edit, Import, Plus, Save, Trash,User, X } from 'lucide-solid'
import { AppSchema } from '../../../srv/db/schema'
import { A } from '@solidjs/router'
import AvatarIcon from '../../shared/AvatarIcon'
import { characterStore, NewCharacter } from '../../store'
import ImportCharacterModal from './ImportCharacter'
import DeleteCharacterModal from './DeleteCharacter'
import Modal from '../../shared/Modal'
import Dropdown from '../../shared/Dropdown'
import { exportCharacter } from '../../../common/prompt'
import {userStore} from '../../store'

const CharacterList: Component = () => {
  const chars = characterStore((s) => s.characters)

  const [showImport, setImport] = createSignal(false)
  const [showDelete, setDelete] = createSignal<AppSchema.Character>()
  const [char, setChar] = createSignal<AppSchema.Character>()
  const {user} = userStore()
  const onImport = (char: NewCharacter) => {
    characterStore.createCharacter(char, () => setImport(false))
  }

  createEffect(() => {
    characterStore.getCharacters()
  })

  return (
    <>
      <PageHeader title="Scenarios" subtitle="" />

      <Show when={!chars.loaded}>
        <div>Loading...</div>
      </Show>
      <Show when={chars.loaded}>
        <div class="flex w-full flex-col gap-2">
         
          <For each={chars.list}>
            {(char) => (
              <Character
                character={char}
                user={user}
                
              />
            )}
          </For>
        </div>
        {chars.list.length === 0 ? <NoCharacters /> : null}
      </Show>
     
     
    </>
  )
}

const Character: Component<{
  character: AppSchema.Character
  user: Function
}> = (props) => {
  return (
    <div class="flex w-full gap-2">
      <div class="flex h-12 w-full flex-row items-center gap-4 rounded-xl bg-[var(--bg-800)]">
        <A
          class="ml-4 flex h-3/4 cursor-pointer items-center rounded-2xl  sm:w-9/12"
          href={`/character/${props.character._id}/chats`}
        >
          <AvatarIcon avatarUrl={props.character.avatar} size="10" class="mx-4" />
          <div class="text-lg font-bold">{props.character.name}</div>
        </A>
      </div>
      <div class="flex flex-row items-center justify-center gap-2 sm:w-3/12">
       <Show when={props.user?.admin}>
        <a onClick={props.download}>
          <Download class="cursor-pointer text-white/25 hover:text-white" />
        </a>
        <A href={`/character/${props.character._id}/edit`}>
          <Edit class="cursor-pointer text-white/25 hover:text-white" />
        </A>

        <A href={`/character/create/${props.character._id}`}>
          <Copy class="cursor-pointer text-white/25 hover:text-white" />
        </A>
        </Show>
        <Show when={props.character.name!=="Aiva"}>
        <Trash class="cursor-pointer text-white/25 hover:text-white" onClick={props.delete} />
        
        <A href={`/likes/${props.character._id}/profile`}>
          <User  class="cursor-pointer text-white/25 hover:text-white" />
        </A>
        </Show>
        
      </div>
    </div>
  )
}

const plainFormats = [{ value: 'text', label: 'Plain Text' }]

const formats = [
  { value: 'boostyle', label: 'Boostyle' },
  { value: 'wpp', label: 'W++' },
  { value: 'sbf', label: 'Square Bracket Format' },
]

/**
 * WIP: Enable downloading characters in different persona formats for different application targets
 */

const DownloadModal: Component<{ show: boolean; close: () => void; char?: AppSchema.Character }> = (
  props
) => {
  let ref: any
  const opts = createMemo(
    () => {
      return props.char?.persona.kind === 'text' ? plainFormats : formats
    },
    { equals: false }
  )

  const [format, setFormat] = createSignal('native')
  const [schema, setSchema] = createSignal(opts()[0].value)

  return (
    <Modal
      show={props.show && !!props.char}
      close={props.close}
      title="Download Character"
      footer={
        <Button schema="secondary" onClick={props.close}>
          <X /> Close
        </Button>
      }
    >
      <form ref={ref} class="flex flex-col gap-4">
        <Dropdown
          label="Output Format"
          fieldName="app"
          value={format()}
          items={[
            { value: 'native', label: 'Agnaistic' },
            { value: 'tavern', label: 'TavernAI' },
            { value: 'ooba', label: 'Textgen' },
          ]}
          onChange={(item) => setFormat(item.value)}
        />
        <div class="flex">
          <Dropdown
            label="Persona Format"
            helperText="If exporting to Agnaistic format, this does not matter"
            fieldName="format"
            items={opts()}
            value={schema()}
            onChange={(item) => setSchema(item.value)}
            disabled={format() === 'native'}
          />
        </div>
        <div class="flex w-full justify-center">
          <a
            href={`data:text/json:charset=utf-8,${encodeURIComponent(
              charToJson(props.char!, format(), schema())
            )}`}
            download={`${props.char!.name}.json`}
          >
            <Button>
              <Save />
              Download
            </Button>
          </a>
        </div>
      </form>
    </Modal>
  )
}

function charToJson(char: AppSchema.Character, format: string, schema: string) {
  const { _id, ...json } = char

  const copy = { ...char }
  copy.persona.kind = schema as any

  if (format === 'native') {
    return JSON.stringify(json, null, 2)
  }

  const content = exportCharacter(copy, format as any)
  return JSON.stringify(content, null, 2)
}

const NoCharacters: Component = () => (
  <div class="mt-16 flex w-full justify-center rounded-full text-xl">
    You have no characters!&nbsp;
    <A class="text-[var(--hl-500)]" href="/character/create">
      Create a character
    </A>
    &nbsp;to get started!
  </div>
)

export default CharacterList