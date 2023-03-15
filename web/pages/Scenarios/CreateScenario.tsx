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
  const [xpNeeded,setXpNeeded] = createSignal(0)
  

function calculateTotalXPNeededForLevel(level) {
  const baseXP = 30
  const xpMultiplier = 1.1
  const xpNeededForFirstLevel = 10
  

  if (level == 1) {
    return xpNeededForFirstLevel;
  } else {
    return Math.floor(baseXP * Math.pow(xpMultiplier, level -1 )) + calculateTotalXPNeededForLevel(level -1 );
  }
}

const xpNeededForLevel = (level) => {
  if(level===xpNeeded||level<1||level=="")return
  setXpNeeded(calculateTotalXPNeededForLevel(level.target.value))
}
 
  createEffect(() => {
    characterStore.getCharacters()
    scenarioStore.getScenarios(editId)
  })

  
  const nav = useNavigate()

  

  const onSubmit = (ev: Event) => {
    
    const body = getStrictForm(ev, {
      title: "string",
      prompt: "string",
      greeting: "string",
    } as const)
    const attributes = getAttributeMap(ev)
    
    
    
    const payload = {
      title: body.title,
      prompt: body.prompt,
      greeeting: body.greeting,
    }
   
    
    if (editId) {
      scenarioStore.createScenario(srcId,payload, () => nav('/admin/scenarios'))
     // characterStore.editCharacter(editId, payload, () => nav('/character/list'))
    } else {
    //  characterStore.createCharacter(payload, () => nav('/character/list'))
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
            <h1 class="text-lg text-gray-200">Title: <span class="text-white">{scenario.name}</span></h1>
            <p class="text-gray-200">Prompt: <span class="text-white">{scenario.prompt}</span></p>
            <p class="text-gray-200">Greeting: <span class="text-white">{scenario.greeting}</span></p>
            <p class="text-gray-100">XP: {scenario.xp}</p>
          

            <Divider />
          </div>
          )}
        </For>
      <h1>LEVEL XP FOR LEVEL {xpNeeded}</h1>
      <TextInput fieldName="xpcalc" label="XP For Level" onChange={xpNeededForLevel} />
    </div>
  )
}

export default CreateScenario