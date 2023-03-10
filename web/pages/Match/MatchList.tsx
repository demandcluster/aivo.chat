import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import Button from '../../shared/Button'
import PageHeader from '../../shared/PageHeader'
import { Check } from 'lucide-solid'
import { AppSchema } from '../../../srv/db/schema'
import { A } from '@solidjs/router'
import AvatarIcon from '../../shared/AvatarIcon'
import { matchStore } from '../../store'


const MatchList: Component = () => {
  const chars = matchStore((s) => s.characters)
  const [showImport, setImport] = createSignal(false)
  const [showDelete, setDelete] = createSignal<AppSchema.Character>()
  
  createEffect(() => {
    matchStore.getMatches()
  })

  return (
    <>
      <PageHeader title="Likes" subtitle="" />

      <Show when={!chars.loaded}>
        <div>Loading...</div>
      </Show>
      <Show when={chars.loaded}>
        <div class="flex w-full flex-col gap-2">
          <For each={chars.list}>
            {(char) => <Match character={char} />}
          </For>
        </div>
        {chars.list.length === 0 ? <NoMatches /> : null}
      </Show>
    
    </>
  )
}

const Match: Component<{ character: AppSchema.Character; delete: () => void }> = (props) => {
  return (
    <div class="flex w-full gap-2">
      <div class="flex h-12 w-full flex-row items-center gap-4 rounded-xl bg-[var(--bg-800)]">
        <A
          class="ml-4 flex h-3/4 cursor-pointer items-center rounded-2xl  sm:w-9/12"
          href={`/likes/${props.character._id}/profile`}
        >
          <AvatarIcon avatarUrl={props.character.avatar} class="mx-4 h-10 w-10 rounded-md" />
          <div class="text-lg font-bold">{props.character.name}</div>
        </A>
      </div>
      <div class="flex flex-row items-center justify-center gap-2 sm:w-3/12">
        <a
          href={`/likes/${props.character._id}/match`}
         >
          <Check class="cursor-pointer text-white/25 hover:text-white" />
        </a>
       
      </div>
    </div>
  )
}

function charToJson(char: AppSchema.Character) {
  const { _id, updatedAt, createdAt, kind, summary,premium,xp,match,avatar, ...json } = char
  return JSON.stringify(json, null, 2)
}

const NoMatches: Component = () => (
  <div class="mt-16 flex w-full justify-center rounded-full text-xl">
    You have no likes!&nbsp;
   
  </div>
)

export default MatchList

function repeat<T>(list: T[], times = 20) {
  const next: any[] = []
  for (let i = 0; i < times; i++) {
    next.push(...list)
  }
  return next
}
