import { Component } from 'solid-js'
import { A } from '@solidjs/router'
import { AppSchema } from '../../srv/db/schema'

const ProfileCard: Component<{ character: AppSchema.Character; href: string }> = (props) => (
  <>
  <div class="hover:scale-150 w-80 bg-cover focusable-card w-1/5">
    <div
      style={{ 'background-image': `url(${props.character.avatar})` }}
      class="h-80 w-80 rounded-t-md bg-cover "

    >
    <div class="p-3 text-lg hover:scale-150">
      <b class="text-lg">{props.character.name}</b>
    </div>
    </div>
   </div>
    <div>
        Something
    </div>
    <div class="p-3 w-4/5">
       <i class="text-italic">{props.character.summary}</i>
    </div>
     
   
   </>
  )

export default ProfileCard
