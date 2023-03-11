import { Component } from 'solid-js'
import { A } from '@solidjs/router'
import { AppSchema } from '../../srv/db/schema'

const ProfileCard: Component<{ character: AppSchema.Character; href: string }> = (props) => (
  <>
  <div class="hover:scale-150  min-w-[33%] w-full bg-cover grow  focusable-card w-1/5">
    <div
      style={{ 'background-image': `url(${props.character.avatar})` }}
      class="h-80 w-80 rounded-t-md bg-cover "

    >
    <div class="p-3 text-lg hover:scale-150">
      <b class="text-lg">{props.character.name}</b>
    </div>
    </div>
   </div>
    
    <div class="p-5 w-4/5">
       <div class=""> 
       <div><i class="text-italic">{props.character.summary}</i></div>
       <br/>
       <div class="flex-col flex gray">
       <div class="">Age:</div><div>{props.character.persona?.attributes?.age}</div>
       <div class="">Body:</div><div>{props.character.persona?.attributes?.body.toString()}</div>
       <div class="">Job:</div><div>{props.character.persona?.attributes?.job.toString()}</div>
       <div class="">Sexuality:</div><div>{typeof props.character.persona?.attributes?.sexuality=== "string" ? props.character.persona?.attributes?.sexuality.toString():"Prefers not to say."}</div>

       </div>
       </div>
    </div>
     
   
   </>
  )

export default ProfileCard
