import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import {useParams} from '@solidjs/router'
import Button from '../../shared/Button'
import ProfileCard from '../../shared/ProfileCard'
import PageHeader from '../../shared/PageHeader'
import Modal from '../../shared/Modal'
import { Check } from 'lucide-solid'
import { AppSchema } from '../../../srv/db/schema'
import { A, useNavigate } from '@solidjs/router'
import AvatarIcon from '../../shared/AvatarIcon'
import { matchStore,characterStore } from '../../store'

const MatchProfile: Component = () => {
    const { id } = useParams()
   
    const chars = matchStore((s) => s.characters)
   
    createEffect(() => {
      matchStore.getMatch(id)
    })
    const navigate=useNavigate()
  
    return (
        <>
          <PageHeader title="Profile" />
    
          <Show when={!chars.loaded}>
            <div>Loading...</div>
          </Show>
          <Show when={chars.loaded}>
           <div class="flex flex-row min-w-full"> 
          <ProfileCard href={`/likes/${chars.list._id}/profile}`} navBack={navigate(-1)} character={chars.list}/>
            </div>
            
          </Show>
        
        </>
      )
}
export default MatchProfile