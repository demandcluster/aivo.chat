import { createSignal,Show } from 'solid-js';
import { Heart } from 'lucide-solid';

interface Props {
  currentXP: number;
  
}
const baseXP = 30
const xpMultiplier = 1.1
const xpNeededForFirstLevel = 10

function calculateTotalXPNeededForLevel(level) {
  if (level === 0) {
    return xpNeededForFirstLevel;
  } else {
    return Math.floor(baseXP * Math.pow(xpMultiplier, level - 1)) + calculateTotalXPNeededForLevel(level - 1);
  }
}
function xpNeededForLevelUp(currentXP:number) {
  
  let xpNeededForNextLevel = xpNeededForFirstLevel
  let currentLevel = 1

  while (currentXP >= xpNeededForNextLevel) {
    xpNeededForNextLevel = Math.floor(baseXP * (xpMultiplier ** (currentLevel - 1)))
    currentXP -= xpNeededForNextLevel
    currentLevel++
  }
  return {xp:xpNeededForNextLevel - currentXP,lvl:currentLevel-1}
}

const Gauge = (props: Props) => {
  const { currentXP } = props
  const xpNeeded=xpNeededForLevelUp(currentXP).xp
  const level = xpNeededForLevelUp(currentXP).lvl
  const levelXP = calculateTotalXPNeededForLevel(level)
  const percentFilled =  Math.min((currentXP - levelXP) / xpNeeded, 1) * 100;

  return (
    <>
    <Show when = {currentXP>10}>
     <div class="flex">
    <div class="relative my-auto h-7 w-6 rounded-full overflow-hidden bg-gray-300">
      <div class={`absolute bottom-0 bg-red-500 w-full`} style={{ height: `${percentFilled}%` }}>
      <Heart class="absolute  text-white bottom-0 left-1/2 transform -translate-x-1/2" /></div>
    </div>
      <div class="text-2xl opacity-60 text-teal-300 m-2">{level}</div>
    </div>
    </Show>
    </>
  );
};

export default Gauge;