import { Router } from 'express'
import { assertValid } from 'frisker'
import { store } from '../db'
import { isAdmin, loggedIn } from './auth'
import { handle } from './wrap'
import {AppSchema} from '../db/schema'
import { now } from '../db/util'
import { v4 } from 'uuid'
import {getAuthHeader} from '../../common/buckaroo'
import needle,{NeedleOptions,NeedleResponse} from 'needle'
import { sendOne} from './ws'
import {config} from '../config'
import paypal from "paypal-rest-sdk"
import https from 'https'
import CRC32 from 'crc-32'
const router = Router()



//const {paypalID,paypalSecret} = config
 const paypalID = "AQlrOxbkPYGnPnoYLjOq4M5Ub_JhzVbpxzM8uv9AlY8RzVH7pXRLqFHKV0jTS5-gB7V_kurLSMsBcIjL"
 const paypalSecret = "EKjgEUtbWVRmOH3niP3_U0MfmgYt3_I7ydj0rvyIs1ZJUwz2jpr8AQdl9durICFpV6xMRG7RrR8UQ3nP"
paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: paypalID,
  client_secret: paypalSecret,
})

interface PaypalItem {
  name: string
  description: string
  price: number
  quantity: number
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS'
}
const paypalLogin = () => {
  return new Promise((resolve, reject) => {
    const data = {
      grant_type: 'client_credentials'
    }

    const options = {
      method: 'POST',
      hostname: 'api-m.sandbox.paypal.com',
      path: '/v1/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${paypalID}:${paypalSecret}`).toString('base64')}`,
      },
    }

    const requestData = 'grant_type=client_credentials'

    const req = https.request(options, (res) => {
      let responseData = ''

      res.on('data', (chunk) => {
        responseData += chunk
      })

      res.on('end', () => {
        const parsedData:any = JSON.parse(responseData)
        const accessToken = parsedData.access_token
        resolve(accessToken)
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(requestData)
    req.end()
  })
}

const createPaypalOrder = async (orderId: string,orderAmount: number, items: AppSchema.ShopItem[]): Promise<string | null> => {
  
    const orderData={
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: orderAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: orderAmount.toFixed(2),
              },
            },
          },
          custom_id: orderId,
          items: items.map((item) => {

            return {
              name: "AIVO.CHAT",
              description: item.name,
              unit_amount: {
                currency_code: 'EUR',
                value: item.price.toFixed(2),
              },
              quantity: 1,
              category: 'DIGITAL_GOODS',
            }
          }),
        },
      ],
      application_context: {
        brand_name: 'AIVO.CHAT',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
      },
    }
  
    const authToken = await paypalLogin();

    const options = {
      hostname: 'api-m.sandbox.paypal.com',
      path: '/v2/checkout/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      }
    };
  
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const orderDataObject = JSON.parse(data)
          resolve(orderDataObject);
        });
      });
  
      req.on('error', (error) => {
        reject(error);
      });
  
      req.write(JSON.stringify(orderData))
      req.end();
    });
}
  
  


const cartTotal = (cartItems: AppSchema.ShopItem[]): number => {
  if (!cartItems || cartItems.length < 1) {
    return 0.00
  }
  const total = cartItems.reduce((total: number, item: AppSchema.ShopItem) => {
    return total + item?.price
  }, 0)
  return Number(total.toFixed(2))
}

const giveOrder= async (order:AppSchema.ShopOrder)=>{
  const items = order.items
  const userId = order.userId
  const orderUser = await store.users.getUser(userId)
  if(!orderUser)return {error:"User not found"}
  const userCredits = orderUser.credits || 0
  const userPremium = orderUser.premium || false
  const userPremiumUntil = orderUser.premiumUntil || Date.now()
  const totalCredits = items.reduce((acc, item) => acc + item.credits, 0)
  const totalDays = items.reduce((acc, item) => acc + item.days, 0)
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
    const cart =  JSON.parse(body.cart) || []
    const service = body.service||null
    const itemsToCheckout:any = []
    cart.forEach((itemId:string) => {
    const item = items.find((item) => item._id === itemId)
    if (item) {
      itemsToCheckout.push(item)
     }
    })

if (itemsToCheckout.length === 0) {
  return { error: 'Items not found' }
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

const orderData:any =await createPaypalOrder(newOrder._id,newOrder.total,itemsToCheckout)

newOrder.paymentId=orderData?.id||null

await store.shop.addShopOrder(newOrder)

return {orderId: orderData?.id||undefined}
})

const getItems = handle(async () => {
  const items = await store.shop.getItems()
  return items
})

const webHook = handle(async ({headers,body,res}) => {
  const parts = headers.toString().split('|');
if (parts && parts.length === 4) {
  const [transmissionId, timeStamp, webhookId, crc32] = parts;
  const checksum = CRC32.str(`${transmissionId}|${timeStamp}|${webhookId}`).toString(16);
  if (checksum === crc32) {
    console.log('Header is valid');
  } else {
    console.log('Header is invalid');
  }
  // Do something with the variables here
} else {
  // Handle the case where the header is not valid
  console.log('Header is invalid');
  return {error:'Header not valid'}
}
  
  
  const bodyObj = JSON.parse(body)

  // if(!res) return {error:'No res'}
  // const webhookTransmissionId = headers['paypal-transmission-id']
  // const webhookTransmissionSig = headers['paypal-transmission-sig']
  // const webhookCertUrl = headers['paypal-cert-url']

  // // verify the webhook signature
  // try {
  //   await verifySignature(webhookTransmissionId, webhookTransmissionSig, webhookCertUrl, webhookEvent)
  // } catch (error) {
  //   console.error('Error verifying webhook signature:', error)
  //   res.sendStatus(400)
  //   return
  // }

  // // process the webhook event
  // const webhookEvent = new Webhook()
  // if(webhookEvent.event_type === 'CHECKOUT.ORDER.COMPLETED'){

  //    console.log(webHookEvent)

  // const paymentId = bodyObj?.id||false
  // if(!paymentId)return  res.sendStatus(400)
  // const orderId = bodyObj.purchase_units[0].custom_id||false
  // if(!orderId)return  res.sendStatus(400)
  // const order = await store.shop.getShopOrder(orderId)
  // if(!order)return  res.sendStatus(400)
  // if(order.paymentId!==paymentId)return {error:"Invalid payment"}

  //   if(order.status==="success"||order.status==="completed"||order.status==="failed")return res.sendStatus(400)
  //     order.status="success"
  //     order.updatedAt=now()
  //     order.name=bodyObj?.purchase_units[0].payee.email_address
  //     await store.shop.updateShopOrder(order)
  //     giveOrder(order)
   

  // }
  console.log(bodyObj)

  if(res)res.sendStatus(400)
})



router.post('/webhook',webHook)
router.get('/', loggedIn, getItems)
router.post('/checkout', loggedIn,checkOut)

export default router
