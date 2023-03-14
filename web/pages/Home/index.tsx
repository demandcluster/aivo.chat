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
      <div class="border-red-400 my-8 w-1/2 mx-4 bg-red-900 border-2-dotted rounded-lg p-4 gap-4">
        <div class="flex flex-row">
        <div>
        <p class="text-gray-300">This website is not for children. It is for adults only.</p>
        <p class="text-gray-300">You must be 18 years of age or older to use this website.</p>
        </div>
        <div class="text-lg">
        18+
          </div>
      </div>
    </div>
  )
}
export default HomePage
