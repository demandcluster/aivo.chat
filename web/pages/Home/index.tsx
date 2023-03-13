import { A } from '@solidjs/router'
import { Component } from 'solid-js'
import PageHeader from '../../shared/PageHeader'
import { adaptersToOptions } from '../../shared/util'
import { settingStore } from '../../store'
import logo from '../../assets/logo.png'
const HomePage: Component = () => {
  const cfg = settingStore((cfg) => ({ adapters: adaptersToOptions(cfg.config.adapters) }))
  return (
    <div>
      <PageHeader
        title={
          <>
            Welcome to <img src={logo} alt="logo" class="w-1/4 mx-10" />
          </>
        }
      />
      <div class="flex flex-col gap-4">
       <span class="text-lg text-italic">Artificial Intelligence Virtual Other</span>
      </div>
      <div class="text-gray-400">
        <p>All matches on this website are AI. They are not real people.</p>
        <p>You have entered a simulation, where your significant other is virtual.</p>
      </div> 
    </div>
  )
}
export default HomePage
