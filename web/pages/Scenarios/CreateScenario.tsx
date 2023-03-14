import { Component, createEffect, createSignal, Show,For } from 'solid-js'
import { Save, X } from 'lucide-solid'
import Button from '../../shared/Button'
import PageHeader from '../../shared/PageHeader'
import TextInput from '../../shared/TextInput'
import Divider from '../../shared/Divider'
import { FormLabel } from '../../shared/FormLabel'
import RadioGroup from '../../shared/RadioGroup'
import { getStrictForm } from '../../shared/util'
import FileInput, { FileInputResult } from '../../shared/FileInput'
import { characterStore,scenarioStore } from '../../store'
import { useNavigate, useParams } from '@solidjs/router'
import PersonaAttributes, { getAttributeMap } from '../../shared/PersonaAttributes'
import AvatarIcon from '../../shared/AvatarIcon'
import { PERSONA_FORMATS } from '../../../common/adapters'



const CreateScenario: Component = () => {
  const { editId, duplicateId } = useParams()
  const srcId = editId || duplicateId || ''
  const state = characterStore((s) => ({
    edit: s.characters.list.find((ch) => ch._id === srcId),
  }))
  const scenarios = scenarioStore()
  
  
 
  createEffect(() => {
    characterStore.getCharacters()
    scenarioStore.getScenarios(editId)
  })

  
  const nav = useNavigate()

  

  const onSubmit = (ev: Event) => {
    
    const body = getStrictForm(ev, {
      kind: PERSONA_FORMATS,
      name: 'string',
      greeting: 'string',
      scenario: 'string',
      summary: 'string',
      xp: 'number',
      premium: 'string',
      match: 'string',
      sampleChat: 'string',
    } as const)
    const attributes = getAttributeMap(ev)
    
    const persona = {
      kind: body.kind,
      attributes,
    }
    
    const payload = {
      name: body.name,
      scenario: body.scenario,
      avatar: avatar(),
      summary: body.summary,
      xp: body.xp,
      match: body.match,
      premium: body.premium,
      greeting: body.greeting,
      sampleChat: body.sampleChat,
      persona,
    }
   
    
    if (editId) {
     
      characterStore.editCharacter(editId, payload, () => nav('/character/list'))
    } else {
      characterStore.createCharacter(payload, () => nav('/character/list'))
    }
  }

  return (
    <div>
      <PageHeader
        title={`${editId ? 'Edit' : duplicateId ? 'Copy' : 'Create'} a Scenario`}
        
      />
      <form class="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextInput
          fieldName="name"
          required
          label="Character Name"
          placeholder=""
          value={state.edit?.name}
          disabled
        />

        <div class="flex w-full gap-2">
          <Show when={state.edit}>
            <div class="flex items-center">
              <AvatarIcon avatarUrl={state.edit?.avatar} size="12" />
            </div>
          </Show>
        
        </div>

      </form>
     
      <For each={scenarios.scenarios.list}>
         { (scenario)=>(
            <div>
            <h1>Title: {scenario.name}</h1>
            <p>Prompt: {scenario.prompt}</p>
            <p>Greeting: {scenario.greeting}</p>
            <p>XP: {scenario.xp}</p>
            <p>Next XP: {scenario.nextxp}</p>

            <Divider />
          </div>
          )}
        </For>
        
    
    </div>
  )
}

export default CreateScenario