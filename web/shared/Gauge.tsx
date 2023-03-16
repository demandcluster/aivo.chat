import { createSignal,Show } from 'solid-js';
import { Heart } from 'lucide-solid';

interface Props {
  currentXP: number;
  
}
const xpNeeded = [10, 40, 73, 109,148,191,239,292,350,414,484,561,646,740,843,956,1081,1218,1369,1535]

function calculateLevelAndPercent(xp) {
  let level = 0;
  let xpNeededForCurrentLevel = xpNeeded[level];
  let xpNeededForPreviousLevel = xpNeeded[level];

  while (xp >= xpNeededForCurrentLevel) {
    level++;
    xpNeededForPreviousLevel = xpNeededForCurrentLevel;
    xpNeededForCurrentLevel = xpNeeded[level] || xpNeededForCurrentLevel;
  }

  const percent = ((xp - xpNeededForPreviousLevel) / (xpNeededForCurrentLevel - xpNeededForPreviousLevel)) * 100;

  return { level, percent };
}

const Gauge = (props: Props) => {
  const { currentXP } = props;
  const {percent,level} = calculateLevelAndPercent(currentXP)

  return ( 
    <>
    <Show when = {level>0}>
     <div class="flex">
    <div class="relative my-auto h-7 w-6 rounded-full overflow-hidden bg-gray-300">
      <div class={`absolute bottom-0 bg-red-500 w-full`} style={{ height: `${percent}%` }}>
      <Heart class="absolute  text-white bottom-0 left-1/2 transform -translate-x-1/2" /></div>
    </div>
      <div class="text-2xl opacity-60 text-teal-300 m-2">{level}</div>
    </div>
    </Show>
    </>
  );
};

export default Gauge;