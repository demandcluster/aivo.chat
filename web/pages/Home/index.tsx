import { A } from '@solidjs/router'
import { Component } from 'solid-js'
import PageHeader from '../../shared/PageHeader'
import { adaptersToOptions } from '../../shared/util'
import { settingStore } from '../../store'

const HomePage: Component = () => {
  const cfg = settingStore((cfg) => ({ adapters: adaptersToOptions(cfg.config.adapters) }))
  return (
    <div>
      <PageHeader
        title={
          <>
            Welcome to A<span class="text-[var(--hl-500)]">I</span>V<span class="text-[var(--hl-500)]">O</span>.CHAT
          </>
        }
      />
      <div class="flex flex-col gap-4">
        <div>
          <span class="font-bold">Useful Links:</span>
          <ul>
            <li>
              •{' '}
              <a
                href="https://github.com/luminai-companion/agn-ai/issues"
                target="_blank"
                class="link"
              >
                Github Repository
              </a>
            </li>
            <li>
              •{' '}
              <a
                href="https://github.com/users/sceuick/projects/1/views/1"
                target="_blank"
                class="link"
              >
                Feature Roadmap
              </a>
            </li>
          </ul>
        </div>
        
        <div class="text-2xl font-bold">Registration</div>
        <p>
          You don't need to register to use AIVO. You can use it anonymously and no data will
          be stored on any servers.
        </p>
        <p>
          It is a bit pointless to use AIVO without an account though, you will not get any likes...
        </p>
       </div>
    </div>
  )
}
export default HomePage
