import { Component } from 'solid-js'
import PageHeader from '../../shared/PageHeader'
import { adaptersToOptions, setComponentPageTitle } from '../../shared/util'
import { settingStore } from '../../store'
import logo from '../../assets/logo.png'
import logoDark from '../../assets/logoDark.png'
import discord from '../../assets/discord-logo-blue.svg'
import Button from '../../shared/Button'
import { markdown } from '../../shared/markdown'
import { A } from '@solidjs/router'

const text = `
Agnaistic is in a fairly early stage of development. Bugs and some rough edges are expected. If you encounter an issue or have an idea you'd like to share you can head over to the [GitHub repository](https://github.com/luminai-companion/agn-ai) and create an issue.

# Registration

You don't need to register to use Agnaistic. You can use it anonymously and no data will be stored on any servers.
If you choose to register, your data will be stored and accessible on any devices you login with.

# Getting Started

### Recommendations

- For the best speed and quality, use a service like OpenAI, NovelAI, or Claude.
- If you're looking for a free option, consider running your own model using Kobold or accumulating kudos on AI Horde.
- If you want to run Agnaistic locally, visit the Github Repository for the various methods of installation.

## Quick Start

A character has been created for you! You can head to the [Characters](/character/list) page, choose a character and create a conversation to get started!
You can edit the character from the Characters page or from the Chat. This may be helpful to see an example of how to author your own character.

- **Characters**: This is where you create, edit, and delete your characters.
- **Chats** page: This is where your conversations reside.
- **Settings**: You can modify the UI, AI, and Image Generation settings from the settings page.
- **Presets**: For more advanced users, you can modify your generation settings (temperature, penalties, prompt settings) here.

## AI Horde

This can sometimes be slow. AI Horde is run and powered by a small number of volunteers that provide their GPUs.

*Keep your 'Max New Tokens' below 100 unless you know what you're doing!*
*Using high values for 'Max New Tokens' is the main cause of timeouts and slow replies.*

By default we use anonymous access and the <b>Pygmalion 6B</b> model. You can provide your API key or change the model in the Settings page.

## Kobold

If you're self-hosting KoboldAI or using Colab, you can use the LocalTunnel URL in the **Kobold URL** field in the Settings page.

## NovelAI

You can provide your API key and choose between Euterpe and Krake in the settings page. Visit the [instructions page](https://github.com/luminai-companion/agn-ai/blob/dev/instructions/novel.md) to learn how to retrieve your API key.
`

const HomePage: Component = () => {
  setComponentPageTitle('Information')
  const cfg = settingStore((cfg) => ({ adapters: adaptersToOptions(cfg.config.adapters) }))
  
  return (
    <div>
      <PageHeader
        title={
          <>
            Welcome to <img src={logoDark} alt="logo" class="w-1/4 mx-10" />
          </>
        }
        subtitle={`Available services: ${cfg.adapters.map((adp) => adp.label).join(', ')}`}
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
