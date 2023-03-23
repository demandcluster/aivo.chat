
import { AppSchema } from '../../srv/db/schema'
import { createStore } from './create'
import { data } from './data'
import { toastStore } from './toasts'
import { userStore } from './user'

type swipeState = {
  count: int
  loaded: boolean
}
export const swipeStore = createStore<swipeState>('swipe', {
  swipe: { count: 0, loaded:false },
})((get, set) => {
  return {
    getSwipe: async () => {
      const res = await data.swipe.getSwipe()
      if (res.error) toastStore.error('Failed to retrieve swipe')
      return res;
    },
    setSwipe: async (_, count: count, onSuccess?: () => void) => {
      const res = await data.swipe.setSwipe(count);
      if (res.error) toastStore.error(`Failed to set swipe: ${res.error}`)
      if (res.result) {
        onSuccess?.()
      }
    },
  }
})