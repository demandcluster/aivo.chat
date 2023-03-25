import { Router } from 'express'
import { assertValid } from 'frisker'
import { store } from '../db'
import { isAdmin, loggedIn } from './auth'
import { handle } from './wrap'


const router = Router()

router.use(loggedIn)

const checkout = handle(async ({ body,userId,user }) => {
   console.log(body)
    const items = await store.shop.getItems()
    const cart =  JSON.parse(body.cart) || [];
    
    const itemsToCheckout:any = [];
    cart.forEach((itemId:string) => {
    const item = items.find((item) => item._id === itemId);
    if (item) {
      itemsToCheckout.push(item);
     }
    })

if (itemsToCheckout.length === 0) {
  return { error: 'Items not found' };
}


  console.log(payment.getCheckoutUrl())

return itemsToCheckout;
})

const getItems = handle(async () => {
  const items = await store.shop.getItems()
  return items
})


router.get('/', getItems)
router.post('/checkout', checkout)

export default router