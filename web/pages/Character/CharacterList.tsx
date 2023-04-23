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
import Select from '../../shared/Select'
import { exportCharacter } from '../../../common/prompt'
import {userStore, scenarioStore} from '../../store'
import {getAssetUrl} from '../../shared/util'	
import Gauge from '../../shared/Gauge'

const CharacterList: Component = () => {
  const chars = characterStore((s) => s.characters)
  const scenarios = scenarioStore((s) => s.scenarios)
  const [showImport, setImport] = createSignal(false)
  const [showDelete, setDelete] = createSignal<AppSchema.Character>()
  const [char, setChar] = createSignal<AppSchema.Character>()
  const {user} = userStore()
  const {scenario} = scenarioStore()

  const onImport = (char: NewCharacter) => {
    characterStore.createCharacter(char, () => setImport(false))
  }

  createEffect(() => {
    characterStore.getCharacters()
  })

  return (
    <>
      <PageHeader title="Matches" subtitle="" />

      <Show when={!chars.loaded}>
        <div>Loading...</div>
      </Show>
      <Show when={chars.loaded}>
        <div class="flex w-full flex-col gap-2">
          <Show when={user?.admin}>
          <div class="flex w-full justify-end gap-2">
            <Button onClick={() => setImport(true)}>
              <Import />
              Import
            </Button>
            <A href="/character/create">
              <Button>
                <Plus />
                Character
              </Button>
            </A>
          </div>
          </Show>
          <div class="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 2xl:grid-cols-4 2xl:gap-4 m-auto ">
          <For each={chars.list}>
            {(char) => (           
              <Character
                character={char}
                user={user}
                delete={() => setDelete(char)}
                download={() => setChar(char)}
              />
            )}
          </For>
          </div>
        </div>
        {!chars.list?.length ? <NoCharacters /> : null}
      </Show>
      <Show when={user?.admin}>
      <ImportCharacterModal show={showImport()} close={() => setImport(false)} onSave={onImport} />
      <DownloadModal show={!!char()} close={() => setChar()} char={char()} />
      </Show>
      <DeleteCharacterModal
        char={showDelete()}
        show={!!showDelete()}
        close={() => setDelete(undefined)}
      />
    </>
  )
}

const Character: Component<{
  scenario: AppSchema.Scenario
  character: AppSchema.Character
  user: Function
  delete: () => void
  download: () => void
}> = (props) => {
  const iconSize = { size: 'lg', corners: 'circle' };
  return (
    <div class="w-full">
    <div class={`${props.user?.admin ? "2xl:h-[21rem] h-80 md:h-[19.5rem]" : "2xl:h-80 h-72 md:h-[18.5rem]" } conic  xl:h-96  hover:before:content-[''] hover:before:absolute hover:before:-z-20 hover:before:-left-1/2 hover:before:-top-1/2 hover:before:w-[200%] hover:before:h-[200%] hover:before:bg-[var(--bg-800)] hover:before:bg-no-repeat 
    hover:before:bg-left-top hover:before:bg-[conic-gradient(transparent,var(--hl-900),transparent_30%)] hover:before:animate-[rotate_3s_linear_infinite]
    hover:after:content-[''] hover:after:absolute hover:after:-z-10 hover:after:left-1 hover:after:top-1 hover:after:w-[calc(100%-8px)] hover:after:h-[calc(100%-8px)] bg hover:after:bg-[var(--bg-800)] hover:after:rounded-md
    relative z-0 overflow-hidden min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-[var(--bg-800)] border-[var(--hl-900)] text-900 max-w-[210px] sm:max-w-[250px] xl:max-w-[93%]      `}>
      <a href={`/character/${props.character._id}/chats`}>
        <img alt="..." src={getAssetUrl(props.character.avatar)} class="w-full align-middle rounded-t-lg min-h-[30px] p-1 object-contain max-h-[13rem] xl:max-h-[19rem] 2xl:max-h-[15rem] "/>
        <div class=" h-14 -mt-14 z-10 bg-gradient-to-b from-transparent to-[var(--bg-800)] relative bg-cover max-w-full max-h-full w-full "   >
        </div>
        <div class="z-10 w-full text-right relative p-2 text-2xl -mt-8 md:text-3xl text-white text-shadow -bottom-6 right-0 md:right-1">
          <span class=" font-black ">{props.character?.name}</span> {((props.character.persona?.attributes?.age) ? props.character?.persona?.attributes?.age[0].split(" ")[0] : '')}
        </div>
      </a>
      <blockquote class="relative pt-6 p-1 md:px-4 mb-8">
        <Show when={props.character.name!=="Aiva"}>
          <div class={props.user?.admin ? "mt-4" : ""} ><Gauge currentXP={props.character.xp} /></div>
        </Show>
        <div class={`${props.user?.admin ? (props.character.name=="Aiva" ? "mt-5" : "-mt-16") : "mt-10" } flex flex-row items-end justify-end gap-2 w-full `} style="justify-content:right">
          <Show when={props.user?.admin}>
            <a onClick={props.download}>
              <Download class="icon-button" />
            </a>
            <A href={`/character/${props.character._id}/edit`}>
              <Edit class="icon-button" />
            </A>

            <A href={`/character/create/${props.character._id}`}>
              <Copy class="icon-button" />
            </A>
            </Show>
            <Show when={props.character.name!=="Aiva"}>
            <Trash class="icon-button" onClick={props.delete} />
            
            <A href={`/likes/${props.character._id}/profile`}>
              <User  class="icon-button" />
            </A>
            </Show>
        </div>
      </blockquote>
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
        <Select
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
          <Select
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
