import { useNavigate } from '@solidjs/router'
import { Check, X } from 'lucide-solid'
import { Component,Show } from 'solid-js'
import { AppSchema } from '../../../srv/db/schema'
import Button from '../../shared/Button'
import Dropdown from '../../shared/Dropdown'
import Modal from '../../shared/Modal'
import PersonaAttributes, { getAttributeMap } from '../../shared/PersonaAttributes'
import TextInput from '../../shared/TextInput'
import { getStrictForm } from '../../shared/util'
import { chatStore,userStore } from '../../store'

const options = [
  { value: 'wpp', label: 'W++' },
  { value: 'boostyle', label: 'Boostyle' },
  { value: 'sbf', label: 'SBF' },
]

const CreateChatModal: Component<{
  show: boolean
  onClose: () => void
  char?: AppSchema.Character
}> = (props) => {
  let ref: any
  const nav = useNavigate()
  const user = userStore((s) => s.user)
  const onCreate = (ev: Event) => {
    if (!props.char) return
  let body=undefined
  let attributes=undefined
   if(user.admin){
     body = getStrictForm(ref, {
      name: 'string',
      greeting: 'string',
      scenario: 'string',
      sampleChat: 'string',
      schema: ['wpp', 'boostyle', 'sbf'],
    } as const)
    attributes = getAttributeMap(ref)
  }else{
      body = getStrictForm(ref, {
      name: 'string',
    } as const)
   
    body.scenario = props.char.scenario
    body.greeting  = props.char.greeting
    body.sampleChat = props.char.sampleChat
    attributes = props.char.persona.attributes
    body.schema = props.char.persona.kind
  }


 
    const characterId = props.char._id

    const payload = { ...body, overrides: { kind: body.schema, attributes } }
    chatStore.createChat(characterId, payload, (id) => nav(`/chat/${id}`))
  }

  return (
    <Modal
      show={props.show}
      close={props.onClose}
      title={`Create Chat with ${props.char?.name}`}
      footer={
        <>
          <Button schema="secondary" onClick={props.onClose}>
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
          value={props.char?.greeting}
          class="text-xs"
        ></TextInput>

        <TextInput
          isMultiline
          fieldName="scenario"
          label="Scenario"
          value={props.char?.scenario}
          class="text-xs"
        ></TextInput>

        <TextInput
          isMultiline
          fieldName="sampleChat"
          label="Sample Chat"
          value={props.char?.sampleChat}
          class="text-xs"
        ></TextInput>

        <Dropdown
          class="mb-2 text-sm"
          fieldName="schema"
          label="Persona"
          items={options}
          value={props.char?.persona.kind}
        />

        <div class="w-full text-sm">
          <PersonaAttributes value={props.char?.persona.attributes} hideLabel />
        </div>
        </Show>
      
      </form>
    </Modal>
  )
}

export default CreateChatModal
