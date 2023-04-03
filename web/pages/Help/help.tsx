import { A } from '@solidjs/router'
import { Component } from 'solid-js'
import PageHeader from '../../shared/PageHeader'
import Divider from '../../shared/Divider'

import logo from '../../assets/logo.png'

const Help: Component = () => {
    return (
      <div class="flex flex-col min-h-screen">
         <PageHeader title="Help" subtitle="Getting started" />
       <div class="flex-grow">
        <section  >
         <div>This website does not offer any real people or real dating. It is a simulation.</div>
         <div>Our AI is trained on a 300 billion parameter neural network. We will improve the AI over time when we get enough premium users.   </div>    
        </section>
        <Divider />
        <section >
          <h3 class="text-2xl">How to use this website?</h3>
          <div>In order to get matches you have to register for a (free) account. Goto <A href="/likes/list">Likes</A> to see all available characters.</div>
         
          <div>When you find someone you like, click the checkmark and you have a match.  You can send your match a message and start a conversation. Remember you are not talking to real people but your are talking to AI. The AI does not realize this (apart from Aiva).</div>
          <div>Every character has scenarios that progress the story. Scenarios will progress the more you chat with a character. You can see the progress on the heart symbol next to the character on the <A href="/character/list">Matches</A> page.</div>
        </section>
        <Divider />
          <section  >
          <h3 class="text-2xl">Chat features</h3>
          <div>When talking about yourself always refer to yourself as You. Example: Hello there *you wave*</div>
          <div>When talking about the other person always refer to them by their name. Example: Hello Julia how are you?</div>
          <div>You can perform an action by placing the action in between asterisks *action*.</div>
          <div>If you don't like a reply, you can just reroll it and get another reply. You can even edit the reply to be exactly as you like. This will take away the fun for a large part, so in order to access the edit feaetures, you first have to toggle the switch on top of the chat window to activate them.</div>
          <div>When you do not want to answer the character but just want them to continue, just say continue. This can be helpful if the character is telling you a story.</div>
          </section>
          <Divider />
          <section  >
          <h3 class="text-2xl">How to get premium?</h3>
          <div><A href="/shop">Click here for our shop.</A></div>
          <div>Upgrade to our premium service and enjoy the benefits of skipping message queues, as well as having your credits recharge twice as fast. Plus, premium users receive a bonus credit recharge of up to 1,000, compared to the standard 200. Don't miss out on these exclusive perks - become a premium user today!</div>
          </section>
          <Divider />
          <section >
          <h3 class="text-2xl">About</h3>
          <div>Artificial Intelligence Virtual Other</div>
          <div>Our app is based on <A href="https://github.com/luminai-companion/agn-ai">AgnAIstic</A>.</div>
          <div>We run our own AI Horde with a custom trained model. Currenly this is a 2.7b model. We will be upgrading to larger models when we have some premium members. We will continue to reinvest in the AI.</div>
          
          <div>AIVO.CHAT is created by Demandcluster B.V. in the Netherlands, we are a small team of developers and designers.</div>
          </section>
          <Divider/>
          </div>
      
            <div class="bottom-0 scroll-mt-12 sticky drop-shadow-sm shadow"><A href="/help/policy">Privacy Policy </A> - <A href="/help/terms">Terms of Use</A></div>
  
      </div>
    )
  }
  export default Help