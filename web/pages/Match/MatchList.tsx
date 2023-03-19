import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import Button from '../../shared/Button'
import PageHeader from '../../shared/PageHeader'
import { Check, Delete, Heart, Undo2, X, AlignLeft } from 'lucide-solid'
import { AppSchema } from '../../../srv/db/schema'
import { A,useNavigate } from '@solidjs/router'
import AvatarIcon from '../../shared/AvatarIcon'
import { matchStore,userStore } from '../../store'
import { SwipeCard, SwipeCardRef, createSwipeCard } from 'solid-swipe-card'

const MatchList: Component = () => { 
  const chars = matchStore((s) => s.characters)
  const totalSwipes = [];
  
  const [showSwipes, setSwipe] = createSignal(0)
  const [undoDisabled, setUndo] = createSignal('disabled')
  const [colorSwipeLeft, setSwipeLeft] = createSignal(' text-red-800 fill-red-800')
  const [colorSwipeRight, setSwipeRight] = createSignal(' text-cyan-400 fill-cyan-400')
  const [showImport, setImport] = createSignal(false)
  const [showDelete, setDelete] = createSignal<AppSchema.Character>()
  const user = userStore()
  const navigate=useNavigate()
  createEffect(() => {
    matchStore.getMatches(user.userId)
  })

  const createMatch=async (charId: string) => {
    const char = chars.list.find((c) => c._id === charId)
    matchStore.createMatch(char).then(() => navigate('/character/list'))
   
  }
  
  const SwipeDirection = 'right' | 'left';
  function swipeAction(direction) {
    setSwipe(showSwipes()+1);
    (direction === 'right' ) ?  createMatch(this.id): '';
    (showSwipes()> 0 ) ?  setUndo(''): setUndo('disabled');
    
  }

  function test (a){
    console.log(a, this);
    switch (a) {
      case 'left':
        setSwipeLeft('bg-red-800 text-white-800 fill-white-800');
        setSwipeRight(' text-cyan-400 fill-cyan-400');
        break;
      case 'right':
        setSwipeLeft(' text-red-800 fill-red-800');
        setSwipeRight('bg-cyan-400 text-white-800 fill-white-800');
        break;
    }
  }
  function SwipeUndo (direction){
    totalSwipes[totalSwipes.length - showSwipes()].snapBack();
    setSwipe(showSwipes()-1);
    (showSwipes()> 0 ) ?  setUndo(''): setUndo('disabled');
  }
  function buttonSwipe (direction){
    totalSwipes[totalSwipes.length - showSwipes()-1].swipe(direction);
  }
  console.log(chars,this);

  // <button onclick={()=>buttonSwipe("left")} class="w-24 xl:w-32 p-2 rounded-lg font-bold text-white hover:scale-125 duration-200 shadow-lg mx-3">
//   <span><Delete class="icon-button w-6 text-white inline-block fill-red-800"/> </span> 
//   <span class="hidden md:inline-block">Swipe</span> 
//   <span class="inline-block"> left</span>
// </button>
// <button disabled={undoDisabled()} onclick={()=>SwipeUndo()} class="w-24 xl:w-32 disabled:opacity-10 disabled:hover:scale-100 bg-zinc-600 p-2 rounded-lg font-bold text-white hover:scale-125 duration-200 shadow-lg mx-3">
//   <Undo2 class="icon-button w-6 text-white inline-block"/> Undo
// </button>
// <button onclick={()=>buttonSwipe("right")} class="w-24 xl:w-32 p-2 rounded-lg font-bold text-white hover:scale-125 duration-200 shadow-lg mx-3 "> 
//   <span class="hidden md:inline-block">Swipe</span> right 
//   <Heart class="icon-button w-6 text-white inline-block fill-cyan-500"/>
// </button>
  return (
    <>
      <PageHeader title="Likes" subtitle="" />
      <Show when={!chars.loaded}>
        <div>Loading...</div>
      </Show>
      <Show when={chars.loaded}>
        <div class="flex w-full flex-col gap-2 overflow-hidden">
          <For each={chars.list}>
            {(char) => <DSwipeCard character={char} match={createMatch} totalSwipes={totalSwipes} swipeAction={swipeAction} test={test} />}
          </For>
          <div class=" mx-auto m-[26em] mb-4 w-96 max-w-5xl xl:w-[29rem] pb-2">
                <button onclick={()=>buttonSwipe("left")} class={`${colorSwipeLeft()} " w-16 h-16 xl:w-20 xl:h-20 p-2 rounded-full font-bold text-white xl:hover:scale-125 duration-200 shadow-lg mx-3 border-red-800 border-solid border-2 "`}> 
                  <X size={40} class={`${colorSwipeLeft()} "icon-button  inline-block "`}/>
                </button>
                <button onclick={()=>SwipeUndo()} class="w-16 h-16 xl:w-20 xl:h-20 disabled:opacity-10 border-emerald-400 border-solid border-2 p-2 rounded-full font-bold text-white xl:hover:scale-125 duration-200 shadow-lg mx-3">
                  <AlignLeft size={40} class="icon-button w-6 text-emerald-400 inline-block"/> 
                </button>
                <button disabled={undoDisabled()} onclick={()=>SwipeUndo()} class="w-16 h-16 xl:w-20 xl:h-20 disabled:opacity-10 disabled:hover:scale-100 border-yellow-300 border-solid border-2 p-2 rounded-full font-bold text-white xl:hover:scale-125 duration-200 shadow-lg mx-3">
                  <Undo2 size={40} class="icon-button w-6 text-yellow-300 inline-block"/> 
                </button>
                <button onclick={()=>buttonSwipe("right")} class={`${colorSwipeRight()} " w-16 h-16 xl:w-20 xl:h-20 p-2 rounded-full font-bold text-white xl:hover:scale-125 duration-200 shadow-lg mx-3 border-cyan-400 border-solid border-2 "`}> 
                  <Heart size={40} class={`${colorSwipeRight()} icon-button text-white inline-block fill-cyan-400 "`}/>
                </button>
          </div>
        </div>
        {chars.list?.length === 0 ? <NoMatches /> : null}
      </Show>
    </>
  )
}

const DSwipeCard: Component<{ character: AppSchema.Character;match: Any  }> = (props) => {
  const apiRef: SwipeCardRef = {};
  props.totalSwipes.push(apiRef);
  const age = (props.character.persona.attributes.age) ? props.character.persona.attributes.age[0].split(" ")[0] : '';
  return (
    <div class="absolute w-full max-w-5xl">
    <SwipeCard class="right-6 likes-middle fixed w-96 h-96 m-auto shadow-lg max-w-[90%] max-h-[90%] border-white border-solid border-[10px] xl:border-[20px] rounded-lg"
    threshold="300" rotationmultiplier="7.5" maxrotation="90" snapbackduration="300" bouncepower="0.1" id={props.character._id} apiRef={apiRef} onSwipe={props.swipeAction} onMove={props.test}>
      <div class="bg-cover w-96 h-96 max-w-full max-h-full" style={{ "background-image": `url(${props.character.avatar})` }}  >
        <div class="w-full absolute size bottom-4 p-2 text-3xl text-white text-shadow"><span class=" font-black ">{props.character.name}</span> {age}</div>
        <div class="absolute bottom-1 h-6 overflow-hidden">
          <For each={props.character.persona.attributes.likes}>
              {(attr) => <div class="  capitalize float-left px-2 py-1 rounded-md bg-gray-700 bg-opacity-80 text-white m-1 text-[8px]">{attr}</div>}
          </For>
        </div>
      </div>
    </SwipeCard>
    </div>
  )
}
const Match: Component<{ character: AppSchema.Character;match: Any  }> = (props) => {
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
      <div class="flex flex-row items-center justify-center gap-2 sm:w-3/12" >
       <div 
          class="ml-4 flex h-3/4 cursor-pointer items-center rounded-2xl sm:w-9/12" onClick={()=>props.match(props.character._id)} >
        
          <Check class="cursor-pointer text-white/25 hover:text-white" />
        red-800
         </div>
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
