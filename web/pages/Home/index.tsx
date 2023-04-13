import { A } from '@solidjs/router'
import { Component } from 'solid-js'
import PageHeader from '../../shared/PageHeader'
import { adaptersToOptions } from '../../shared/util'
import { settingStore } from '../../store'
import logo from '../../assets/logo.png'
import logoDark from '../../assets/logoDark.png'
import discord from '../../assets/discord-logo-blue.svg'
import Button from '../../shared/Button'

const HomePage: Component = () => {
  const cfg = settingStore((cfg) => ({ adapters: adaptersToOptions(cfg.config.adapters) }))
  
  return (
    <div>
      <PageHeader
        title={
          <>
            Welcome to <img src={logoDark} alt="logo" class="w-1/4 mx-10" />
          </>
        }
      />
      <div class="flex flex-col gap-4  flex-shrink" >
       <span class="text-lg text-italic">Artificial Intelligence Virtual Other</span>
      </div>
      <div class="text-gray-400">
        <p>All matches on this website are AI. They are not real people.</p>
        <p>You have entered a simulation, where your significant other is virtual.</p>
      </div> 
      <div class="border-red-400 shadow-gray-800 shadow drop-shadow-lg opacity-60 my-8 w-1/2 max-w-1/2 mx-4 bg-red-900 border-2-dotted rounded-lg p-4 gap-4">
        <div class="flex flex-row">
        <div>
        <p class="text-red-100">This website is not for children.<br/>It is for adults only.</p>
      
        </div>
        <div class="text-red-300 shrink-0 text-right max-w-4 text-6xl">
        18+
          </div>
      </div>
    </div>
      <div class="flex flex-col gap-2 flex-grow " >
       <div class="text-lg text-italic">
        Why 18+?
        </div>
        <div class="text-md text-gray-400">
         The topic of this simulation is dating, anything can happen. We have no control over what the AI will say exactly. 
         We feel that both the topic and the possible AI responses are not suitable for children.
        </div>
        </div>
      <div>
        <p class="text-lg text-center gap-4 mt-4 lg:text-2xl text-gray-500 animate-pulse">:::EARLY::ACCESS:::REGISTRATION::LIMITED:::</p>
      </div>
      <div class="gap-4 mt-20 mx-4 center flex-end bg-gray-500 max-w-sm p-11 rounded-md shadow-gray-800 shadow drop-shadow-lg">
       Join us on Discord for updates and to get early access code to the website.
      <Button class="my-4 drop-shadow-xl shadow-emerald-500 shadow"><a href="https://discord.gg/vr8M57PDwH" target="blank"> <img src={discord} alt="discord" class="w-36 max-w-sm" /></a></Button>
      </div>  
      <div class="h-4 p-4 m-4 text-gray-400 text-center">
        &copy; 2023 Demandcluster
        </div>
    </div>
  )
}
export default HomePage
