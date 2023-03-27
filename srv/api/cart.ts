import { Router } from 'express'
import { assertValid } from 'frisker'
import { store } from '../db'
import { isAdmin, loggedIn } from './auth'
import { handle } from './wrap'
import {AppSchema} from '../db/schema'
import { now } from '../db/util'
import { v4 } from 'uuid'
import {getAuthHeader} from '../../common/buckaroo'
import needle from 'needle'
import { sendOne} from 'ws'
import {config} from '../config'

const router = Router()

const {buckarooUrl, buckarooKey, buckarooSecret} = config


interface BuckarooPayment{
 Currency: "EUR"
 AmountDebit: number
 AmountCredit?: number
 Invoice?: string
 Description?: string,
 ClientIP?: {
   Type: 0
   Address: string
  }
 ReturnURL?: string
 ReturnURLCancel?: string
 ReturnURLError?: string
 ReturnURLReject?: string
 OriginalTransactionKey?: string
 StartRecurrent?: boolean
 ContinueOnIncomplete?: boolean
 ServicesSelectableByClient?: string
 ServicesExcludedForClient?: string
 PushURL?: string
 PushURLFailure?: string
 ClientUserAgent?: string
 OriginalTransactionReference?: null
}

const cartTotal = (cartItems: AppSchema.ShopItem[]): number => {
  if (!cartItems || cartItems.length < 1) {
    return 0.00;
  }
  const total = cartItems.reduce((total: number, item: AppSchema.ShopItem) => {
    return total + item?.price;
  }, 0);
  return Number(total.toFixed(2));
};

const giveOrder= async (order:AppSchema.ShopOrder)=>{
  const items = order.items
  const userId = order.userId
  const orderUser = await store.users.getUser(userId)
  if(!orderUser)return {error:"User not found"}
  const userCredits = orderUser.credits || 0
  const userPremium = orderUser.premium || false
  const userPremiumUntil = orderUser.premiumUntil || Date.now()
  const totalCredits = items.reduce((acc, item) => acc + item.credits, 0);
  const totalDays = items.reduce((acc, item) => acc + item.days, 0);
  const newPremium = userPremium || totalDays > 0
  const newCredits = userCredits + totalCredits
  const newPremiumUntil = newPremium && totalDays>0 ? userPremiumUntil + totalDays * 24 * 60 * 60 * 1000 : userPremiumUntil
  await store.users.updateUser(userId, {credits: newCredits, premium: newPremium, premiumUntil: newPremiumUntil})
  order.status='completed'
  const updateOrder = await store.shop.updateShopOrder(order)
  sendOne(userId, { type: 'credits-updated',newCredits })
}
const checkOut = handle(async ({ body,userId,user,ip }) => {
   
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
if(!userId)return {error:'User not found'}

const newOrder:AppSchema.ShopOrder={
  _id: v4(),
  kind: 'order',
  items:itemsToCheckout,
  status: 'pending',
  userId: userId,
  total: cartTotal(itemsToCheckout),
  createdAt: now(),
  updatedAt: now(),
  }
const newPayment:BuckarooPayment={
  Currency: "EUR",
  AmountDebit: newOrder.total,
  Invoice: newOrder._id,
  Description: "AIVO.CHAT Order for " + user?.username,
  ClientIP: {
    Type: 0,
    Address: ip
  },
  ReturnURL: "https://aivo.chat/thankyou",
  ReturnURLCancel: "https://aivo.chat/shop/error",
  ReturnURLError: "https://aivo.chat/shop/error",
  ReturnURLReject: "https://aivo.chat/shop/error",
  PushURL: "https://aivo.chat/api/shop/webhook",
 // ServicesSelectableByClient: "ideal,mastercard,visa",
  ContinueOnIncomplete: true
}


const paymentJson = JSON.stringify(newPayment)
const authHeader = getAuthHeader(buckarooUrl,buckarooKey,buckarooSecret,paymentJson,"POST")

const res = await needle('post', "https://"+buckarooUrl, paymentJson, {
  json: true,
  headers: {
    'Authorization': authHeader
  }
})

const redirURL=res.body?.RequiredAction?.RedirectURL||""
const key = res.body?.Key||false
if(!key)return {error:"Payment failed"}
if(!redirURL)return {error:"Payment failed"}
newOrder.paymentId=key
await store.shop.addShopOrder(newOrder)

return {redirect: redirURL}
})

const getItems = handle(async () => {
  const items = await store.shop.getItems()
  return items
})

const webHook = handle(async ({body}) => {
 
  const bodyObj = body
  const {Transaction} = bodyObj
  const paymentId = Transaction?.Key||false
  if(!paymentId)return {error:"Payment failed"}
  const orderId = Transaction?.Invoice||false
  if(!orderId)return {error:"Payment failed"}
  const order = await store.shop.getShopOrder(orderId)
  if(!order)return {error:"Order not found"}
  if(order.paymentId!==paymentId)return {error:"Invalid payment"}

  if(Transaction?.Status?.Code?.Code===190){
    if(order.status==="success"||order.status==="completed")return {error: "Order already completed"}
      order.status="success"
      order.updatedAt=now()
      order.name=Transaction?.CustomerName
      await store.shop.updateShopOrder(order)
      giveOrder(order)
    }else{
      order.status="failed"
      order.name=Transaction?.CustomerName
      order.updatedAt=now()
      await store.shop.updateShopOrder(order)
    }

  return {success:true}
})

router.get('/', loggedIn, getItems)
router.post('/checkout', loggedIn,checkOut)
router.post('/webhook',webHook)

export default router
