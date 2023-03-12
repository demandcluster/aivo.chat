import { Router } from 'express'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { config } from '../config'
import { isConnected } from '../db/client'
import { handle } from './wrap'

const router = Router()

const appConfig: any = {
  adapters: config.adapters,
  version: null,
}

const getAppConfig = handle(async () => {
  const canAuth = isConnected()

  const v = process?.env?.npm_package_version || 'version unknown'

  if (appConfig.version === null) {
    const content = v
    appConfig.version = content.toString().trim().slice(0, 11)
  }

  return { ...appConfig, canAuth }
})

router.get('/', getAppConfig)

export default router
