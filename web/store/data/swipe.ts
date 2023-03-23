import { v4 } from 'uuid'
import { loadItem, local } from './storage'

export async function getSwipe() {
  const swipe = loadItem('swipe');
  return { count:  swipe , loaded:true, error: undefined }
}

export async function setSwipe(count: int) {
  local.saveSwipe(count)
  return { result: true, error: undefined }
}


