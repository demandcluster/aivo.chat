import { Component,For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { AppSchema } from '../../srv/db/schema'
import { characterStore } from '../../store'


const ProfileCard: Component<{ character: AppSchema.Character; href: string }> = (props) =>(
  <>
  <Show when={props.character}>
  <div class="flex flex-col flex-wrap xl:flex-nowrap xl:flex-row">
  <div class="hover:scale-150 min-w-max mx-auto xl:mx-0  grow focusable-card">
    <div
      style={{ 'background-image': `url(${props.character.avatar})` }}
      class="h-80 w-80 rounded-t-md bg-cover "

    >

    <div class="p-3 text-lg hover:scale-150 font-bold">
      {props.character?.name}
    </div>
    </div>
   </div>
    
    <div class="p-5 min-w-full">
       
       <div class="mb-4"><i class="text-italic">{props.character?.summary}</i></div>
      
       <div class="flex-col flex gray max-w-md mx-4 bg-teal-800 text-yellow-100 border-teal-400 border-2 p-4 first-letter:capitalize">
       <div class="text-sm text-gray-100">Age:</div><div class="mx-4 text-xs">{props.character.persona?.attributes?.age}</div>
      <div class="flex flex-row">
        <div>
       <div class="text-sm text-gray-100">Body:</div>
        <For each={props.character.persona?.attributes?.body}
        fallback={<div>None</div>}>
          {(body) => <div class="first-letter:capitalize mx-4 text-xs">{body}</div>}
        </For>
        </div>
        <div>
        <div class="text-sm text-gray-100">Likes</div>
        <For each={props.character.persona?.attributes?.likes}
        fallback={<div>None</div>}>
          {(body) => <div class="first-letter:capitalize mx-4 text-xs">{body}</div>}
        </For>
        </div>
        <div>
       <div class="text-sm text-gray-100">Job:</div>
       <div class="mx-4 first-letter:capitalize text-xs">{props.character.persona?.attributes?.job||""}</div>
       <div class="text-sm text-gray-100">Sexuality:</div>
       <For each={props.character.persona?.attributes?.sexuality}
        fallback={<div>Prefers not to say</div>}>
       {(sex) => <div class="mx-4 first-letter:capitalize text-xs">{sex}</div>}
        </For>
        </div>
       </div>
       </div>
    </div>
    </div>
     </Show>
   
   </>
  )

export default ProfileCard
