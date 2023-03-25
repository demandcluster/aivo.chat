import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import Button from '../../shared/Button'
import PageHeader from '../../shared/PageHeader'
import { Check, Delete, Heart, Undo2, X, AlignLeft } from 'lucide-solid'
import { AppSchema } from '../../../srv/db/schema'
import { A,useNavigate } from '@solidjs/router'
import AvatarIcon from '../../shared/AvatarIcon'
import { matchStore,userStore, swipeStore } from '../../store'

import {SwipeCard} from '../../shared/Swipe'
import type { SwipeCardRef} from '../../shared/Swipe'

const MatchList: Component = () => {
  const chars = matchStore((s) => s.characters)
  const swipeCount = swipeStore();
  
  let totalSwipes = [];
  
  const showZindex = {min: 1000000, plus: 2000000};
  const [showSwipes, setSwipe] = createSignal(0)
  const [undoDisabled, setUndo] = createSignal('disabled')
  const [colorSwipeMove, setSwipeMove] = createSignal(
    {
      left: ' text-red-500 fill-red-500 ',
      right: ' text-emerald-400 fill-emerald-400',
      up: ' text-cyan-300 fill-cyan-300',
      down: ' text-orange-300 '
    }
  );

  const [showImport, setImport] = createSignal(false)
  const [showDelete, setDelete] = createSignal<AppSchema.Character>()
  const user = userStore()
  const navigate=useNavigate()

  createEffect(() => {
    totalSwipes = [];
    matchStore.getMatches(user.userId)
    swipeStore.getSwipe();
  })
  
  const createMatch=async (charId: string) => {
    const char = chars.list.find((c) => c._id === charId)
    //matchStore.createMatch(char).then(() => navigate('/character/list'))
    matchStore.createMatch(char);
  }
  
  const SwipeDirection = 'right' | 'left';
  function swipeAction(direction) {
    let swipeNowAmount = 0;
    if(direction === 'down') direction = 'left';
    if(direction === 'right' || direction === 'left'){
        showZindex.min--;
        this.apiRef.restoreBack(showZindex.min);
        swipeNowAmount = showSwipes() + 1;
        if(swipeNowAmount+swipeCount.count > totalSwipes.length ){
          swipeNowAmount = 0;
        }
    }
    switch (direction) {
      case 'right':
        createMatch(this.id);
        this.apiRef.remove();
        totalSwipes.splice((totalSwipes.length - showSwipes() - swipeCount.count),1);
        // swipeCount.count--;
        break;
      case 'up':
        showProfile();
        break;
    }
    if(direction === 'right' || direction === 'left'){
      swipeStore.setSwipe(swipeNowAmount+swipeCount.count);
      setSwipe(swipeNowAmount);
      (showSwipes()> 0 ) ?  setUndo(''): setUndo('disabled');
    }
  }

  function swipeMovement (a){
    switch (a) {
      case 'left':
        setSwipeMove({
          left: 'bg-red-500 text-white scale-100',
          right: ' text-emerald-400 fill-emerald-400 scale-80',
          up: ' text-cyan-300 fill-cyan-300 scale-100',
          down: ' text-orange-300 '
        });
        break;
      case 'right':
        setSwipeMove({
          left: ' text-red-500 fill-red-800 scale-80',
          right: 'bg-emerald-400 text-white scale-100',
          up: ' text-cyan-300 fill-cyan-300 scale-100',
          down: ' text-orange-300 '
        });
        break;
      case 'up':
        setSwipeMove({
          left: ' text-red-500 fill-red-800',
          right: ' text-emerald-400 fill-emerald-400 scale-100',
          up: 'bg-cyan-400 text-white scale-100',
          down: ' text-orange-300 '
        });
        break;
      case 'down':
        setSwipeMove({
          left: 'bg-red-500 text-white scale-100',
          right: ' text-emerald-400 fill-emerald-400 scale-80',
          up: ' text-cyan-300 fill-cyan-300 scale-100',
          down: ' text-orange-300 '
        });
        break;
      case 'restore':
        setSwipeMove({
          left: ' text-red-500 fill-red-800',
          right: ' text-emerald-400 fill-emerald-400 scale-100',
          up: ' text-cyan-300 fill-cyan-300 scale-100',
          down: ' text-orange-300 '
        });
        break;
    }
  }
  function showProfile (){
    navigate(`/likes/${totalSwipes[totalSwipes.length-swipeCount.count-1-showSwipes()].id}/profile`)
  }
  function SwipeUndo (){
    totalSwipes[totalSwipes.length - showSwipes() - swipeCount.count].snapBack();
    swipeStore.setSwipe(showSwipes()-1);
    setSwipe(showSwipes()-1);
    (showSwipes()> 0 ) ?  setUndo(''): setUndo('disabled');
  }
  function buttonSwipe (direction){
    if((totalSwipes.length-swipeCount.count-1-showSwipes())<0){
     setSwipe(showSwipes()-totalSwipes.length);
    }
    console.log(totalSwipes);
    console.log(totalSwipes.length,swipeCount.count,1,showSwipes());
    totalSwipes[totalSwipes.length-swipeCount.count-1-showSwipes()].swipe(direction);
  }
  
  return (
    <>
      <PageHeader title="Likes" subtitle="" />
      <Show when={!chars.loaded || !swipeCount.loaded}>
        <div>Loading...</div>
      </Show>
      <Show when={chars.loaded && swipeCount.loaded} >
        <div class="flex w-full flex-col gap-2 ">
          <For each={chars.list}>
            {(char) => <DSwipeCard character={char} match={createMatch} totalSwipes={totalSwipes} swipeAction={swipeAction} swipeMovement={swipeMovement} swipeCount={swipeCount} totalCount={chars.list.length}  showZindex={showZindex} />}
          </For>
          <div class=" relative sm:top-40 sm:pl-1 mx-auto m-[26em] mb-4 sm:w-96 max-w-5xl md:w-[26rem] pb-2">
                <button onclick={()=>buttonSwipe("left")} class={`${colorSwipeMove().left} " w-16 h-16 md:w-20 md:h-20 p-2 rounded-full font-bold text-white md:hover:scale-125 duration-200 shadow-lg mx-3 border-red-500 border-solid border-2 "`}> 
                  <X size={40} class={`${colorSwipeMove().left} "  icon-button inline-block "`}/>
                </button>
                <button onclick={()=>showProfile()} class={`${colorSwipeMove().up} " w-14 h-14 md:w-16 md:h-16 disabled:opacity-10 border-cyan-300 border-solid border-2 p-2 rounded-full font-bold text-white md:hover:scale-125 duration-200 shadow-lg mx-3 align-bottom "`}>
                  <AlignLeft size={30} class={`${colorSwipeMove().up} " icon-button w-6 inline-block"`}/> 
                </button>
                <button disabled={undoDisabled()} onclick={()=>SwipeUndo()} class={`${colorSwipeMove().down} " w-14 h-14 md:w-16 md:h-16 disabled:opacity-10 disabled:hover:scale-100 border-orange-300 border-solid border-2 p-2 rounded-full font-bold text-white md:hover:scale-125 duration-200 shadow-lg mx-3 align-bottom "`}>
                  <Undo2 size={30} class={`${colorSwipeMove().down} " icon-button w-6 inline-block"`}/> 
                </button>
                <button onclick={()=>buttonSwipe("right")} class={`${colorSwipeMove().right} " w-16 h-16 md:w-20 md:h-20 p-2 rounded-full font-bold text-white md:hover:scale-125 duration-200 shadow-lg mx-3 border-emerald-400 border-solid border-2 "`}> 
                  <Heart size={40} class={`${colorSwipeMove().right}  " icon-button inline-block fill-emerald-400 "`}/>
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
  apiRef.id = props.character._id;
  props.totalSwipes.push(apiRef);
  let zindex = 0;
  if((props.totalSwipes.length ) <= (props.totalCount - props.swipeCount.count)){
    props.showZindex.plus++;
    zindex = `${ props.showZindex.plus}`;
  }else{
    props.showZindex.min++;
    zindex = `${ props.showZindex.min}`;
  }
  if(props.totalCount === props.totalSwipes.length){
    props.showZindex.min -= props.totalCount;
  }
  const age = (props.character.persona.attributes.age) ? props.character.persona.attributes.age[0].split(" ")[0] : '';
  return (
    <div class="absolute w-full max-w-5xl">
    <SwipeCard zindex={zindex} class=" bg-[var(--bg-800)]  right-6 likes-middle fixed  w-96 h-96 sm:w-9/12 sm:h-3/4 m-auto shadow-lg max-w-[92%] sm:max-w-[550px] max-h-[550px] border-white border-solid border-[10px] md:border-[20px] rounded-lg"
    threshold="300" rotationmultiplier="7.5" maxrotation="90" snapbackduration="300" bouncepower="0.1" id={props.character._id} apiRef={apiRef} onSwipe={props.swipeAction} onMove={props.swipeMovement}>
      <div class="absolute bg-cover max-w-full max-h-full w-full h-full" style={{ "background-image": `url(${props.character.avatar})` }}  >
        <div class="w-full absolute size bottom-4 sm:bottom-10 sm:text-5xl p-2 text-3xl text-white text-shadow"><span class=" font-black ">{props.character.name}</span> {age}</div>
        <div class="absolute bottom-1 h-6 overflow-hidden sm:h-10">
          <For each={props.character.persona.attributes.likes}>
              {(attr) => <div class="  capitalize float-left px-2 py-1 rounded-md bg-[var(--hl-900)] bg-opacity-80 m-1 text-[8px] sm:text-[12px] sm:py-2">{attr}</div>}
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
