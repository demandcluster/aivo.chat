import { createSignal,Show } from 'solid-js';
import { Heart } from 'lucide-solid';

interface Props {
  currentXP: number;
  
}
const baseXP = 30
const xpMultiplier = 1.1
const xpNeededForFirstLevel = 10

function calculateTotalXPNeededForLevel(level) {
  if (level < 1) {
    return xpNeededForFirstLevel;
  } else {
    return Math.floor(baseXP * Math.pow(xpMultiplier, level -1  )) + calculateTotalXPNeededForLevel(level -1 );
  }
}
function xpNeededForLevelUp(currentXP:number) {
  let xpNeededForNextLevel = xpNeededForFirstLevel;
  let currentLevel = 1;

  if (currentXP < xpNeededForFirstLevel) {
    return { xp: xpNeededForFirstLevel - currentXP, lvl: currentLevel };
  }

  while (currentXP >= xpNeededForNextLevel) {
    const totalXPNeeeded = calculateTotalXPNeededForLevel(currentLevel - 1);
    xpNeededForNextLevel = calculateTotalXPNeededForLevel(currentLevel) - totalXPNeeeded;
    currentXP -= xpNeededForNextLevel;
    currentLevel++;
  }

  return { xp: xpNeededForNextLevel - currentXP, lvl: currentLevel };
}

const Gauge = (props: Props) => {
  const { currentXP } = props
  const xpNeeded=xpNeededForLevelUp(currentXP).xp
  const level = xpNeededForLevelUp(currentXP).lvl
  const levelXP = calculateTotalXPNeededForLevel(level)
  const percentFilled = Math.min((currentXP - levelXP) / (xpNeeded - xpNeededForFirstLevel), 1) * 100;


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