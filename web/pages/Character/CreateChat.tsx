import { useNavigate } from '@solidjs/router'
import { Check, X } from 'lucide-solid'
import { Component, createEffect, createMemo, createSignal, For, Show } from 'solid-js'
import { AppSchema } from '../../../srv/db/schema'
import Button from '../../shared/Button'
import Select from '../../shared/Select'
import Modal from '../../shared/Modal'
import PersonaAttributes, { getAttributeMap } from '../../shared/PersonaAttributes'
import TextInput from '../../shared/TextInput'
import { getForm, getFormEntries, getStrictForm } from '../../shared/util'
import { characterStore, chatStore,userStore } from '../../store'

const options = [
  { value: 'wpp', label: 'W++' },
  { value: 'boostyle', label: 'Boostyle' },
  { value: 'sbf', label: 'SBF' },
]

const CreateChatModal: Component<{
  show: boolean
  close: () => void
  id?: string
  char?: AppSchema.Character
}> = (props) => {
  let ref: any

  const nav = useNavigate()
  const user = userStore()  
  const [selectedChar, setChar] = createSignal<AppSchema.Character>()
  const state = characterStore((s) => ({
    chars: s.characters?.list || [],
    loaded: s.characters.loaded,
  }))

  const char = createMemo(() => {
    const curr = selectedChar() || props.char
    return curr
  })

  createEffect(() => {
    if (!selectedChar() && !props.char && state.chars.length) {
      if (props.id) {
        const char = state.chars.find((ch) => ch._id === props.id)
        if (char) setChar(char)
        return
      }

      setChar(state.chars[0])
    }
  })

  const selectChar = async (chr: AppSchema.Character) => {
    setChar(chr)
  }

  const onCreate = () => {
    const character = selectedChar() || props.char
    if (!character) return

    let body    
    const characterId = character._id
    let attributes:any = []
    if(user.admin){
      body = getStrictForm(ref, {
        name: 'string',
        greeting: 'string',
        scenario: 'string',
        sampleChat: 'string',
        schema: ['wpp', 'boostyle', 'sbf' ,'text'],
      } as const)
      attributes = getAttributeMap(ref)
    
    }else{
      
         body = getStrictForm(ref, {
       name: 'string',
     } as const)
     body.scenario = character.scenario
     body.greeting  = character.greeting
     body.sampleChat = character.sampleChat
     attributes =character.persona.attributes
     body.schema = character.persona.kind
    }

    const payload = { ...body, overrides: { kind: body.schema, attributes } }
    chatStore.createChat(characterId, payload, (id) => nav(`/chat/${id}`))
  }

  return (
    <Modal
      show={props.show}
      close={props.close}
      title={`Create Chat with ${char()?.name}`}
      maxWidth="half"
      footer={
        <>
          <Button schema="secondary" onClick={props.close}>
            <X />
            Close
          </Button>

          <Button onClick={onCreate}>
            <Check />
            Create
          </Button>
        </>
      }
    >
      <form ref={ref}>
        <Show when={user?.admin}>
        <div class="mb-2 text-sm">
          Optionally modify some of the conversation context. You can override other aspects of the
          character's persona from the conversation after it is created.
        </div>
        </Show>
        <div class="mb-4 text-sm">
          The information provided here is only applied to the newly created conversation.
        </div>
        <Show when={!props.char}>
          <Select
            items={state.chars.map((char) => ({ label: char.name, value: char._id }))}
            fieldName="character"
            label="Character"
            helperText="The conversation's central character"
            onChange={(item) => selectChar(state.chars.find((ch) => ch._id === item.value)!)}
          />
        </Show>

        <TextInput
          class="text-sm"
          fieldName="name"
          label="Conversation Name"
          helperText={
            <span>
              A name for the conversation. This is purely for labelling. <i>(Optional)</i>
            </span>
          }
          placeholder="Untitled"
        />
        <Show when={user?.admin}>
        <TextInput
          isMultiline
          fieldName="greeting"
          label="Greeting"
          value={char()?.greeting}
          class="text-xs"
        ></TextInput>

        <TextInput
          isMultiline
          fieldName="scenario"
          label="Scenario"
          value={char()?.scenario}
          class="text-xs"
        ></TextInput>

        <TextInput
          isMultiline
          fieldName="sampleChat"
          label="Sample Chat"
          value={char()?.sampleChat}
          class="text-xs"
        ></TextInput>

        <Show when={(props.char?.persona.kind || char()?.persona.kind) !== 'text'}>
          <Select
            class="mb-2 text-sm"
            fieldName="schema"
            label="Persona"
            items={options}
            value={props.char?.persona.kind || char()?.persona.kind}
          />
        </Show>

        <Show when={(props.char?.persona.kind || char()?.persona.kind) === 'text'}>
          <Select
            class="mb-2 text-sm"
            fieldName="schema"
            label="Persona"
            items={[{ label: 'Plain text', value: 'text' }]}
            value={'text'}
          />
        </Show>

        <div class="w-full text-sm">
          <Show when={props.char}>
            <PersonaAttributes
              value={props.char!.persona.attributes}
              hideLabel
              plainText={props.char?.persona.kind === 'text'}
            />
          </Show>
          <Show when={!props.char && !!selectedChar()}>
            {/* <PersonaAttributes
              value={selectedChar()?.persona.attributes}
              hideLabel
              plainText={selectedChar()?.persona.kind === 'text'}
            /> */}
            <For each={state.chars}>
              {(item) => (
                <Show when={selectedChar()?._id === item._id}>
                  <PersonaAttributes
                    value={item.persona.attributes}
                    hideLabel
                    plainText={item.persona.kind === 'text'}
                  />
                </Show>
              )}
            </For>
          </Show>
        </div>
        </Show>
      
      </form>
    </Modal>
  )
}

export default CreateChatModal
