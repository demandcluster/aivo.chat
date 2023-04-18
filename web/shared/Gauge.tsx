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
  let {percent,level} = calculateLevelAndPercent(currentXP)
  if(level==0){percent = "0";}
  const highbox = 25-Math.round(percent /4);
  return ( 
    <>
      <div class="flex justify-between mb-1">
        <div class="text-base font-medium   "> 
          <div><Heart class="absolute inline-block transform " /><Heart class="absolute transform hearttest fill-red-600" viewBox={`0 ${highbox} 24 24`} style={`top: ${(32+highbox)}px`} /></div>
          <div class=" ml-8 inline-block">Level: {level}</div>
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div class= {`bg-[var(--hl-900)] h-2.5 rounded-full` } style={`width: ${Math.round(percent)}%`}></div>
    </div>
    </>
  );
};

export default Gauge;