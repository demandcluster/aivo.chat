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
import { sendOne} from './ws'
import {config} from '../config'

const router = Router()

const {paypalID,paypalSecret} = config


import { CheckoutNodeJssdk,WebhookEvent,verifySignature } from '@paypal/checkout-server-sdk';

interface PaypalItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';
}

const createPaypalOrder = async (orderId: string,orderAmount: number, items: AppSchema.ShopItem[]): Promise<string | null> => {
  try {
    const client = new CheckoutNodeJssdk({
      clientId: paypalID || '',
      clientSecret: paypalSecret,
      environment: process.env?.PAYPAL_ENVIRONMENT || 'sandbox',
    });

    const request = new client.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
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
            };
          }),
        },
      ],
      application_context: {
        brand_name: 'AIVO.CHAT',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
      },
    });

    const response = await client.execute(request);

    if (response.statusCode !== 201) {
      console.error(response);
      return "";
    }

    return response.result.id;
  } catch (err) {
    console.error(err);
    return "";
  }
};



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
    const service = body.service||null
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
  
const orderId=await createPaypalOrder(newOrder._id,newOrder.total,itemsToCheckout)


newOrder.paymentId=orderId
await store.shop.addShopOrder(newOrder)

return {orderId: orderId}
})

const getItems = handle(async () => {
  const items = await store.shop.getItems()
  return items
})

const webHook = handle(async ({headers,body,res}) => {
 
  const bodyObj = JSON.parse(body)

  if(!res) return {error:'No res'}
  const webhookTransmissionId = headers['paypal-transmission-id'];
  const webhookTransmissionSig = headers['paypal-transmission-sig'];
  const webhookCertUrl = headers['paypal-cert-url'];

  // verify the webhook signature
  try {
    await verifySignature(webhookTransmissionId, webhookTransmissionSig, webhookCertUrl, webhookEvent);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    res.sendStatus(400);
    return;
  }

  // process the webhook event
  const webhookEvent = new Webhook();
  if(webhookEvent.event_type === 'CHECKOUT.ORDER.COMPLETED'){

     console.log(webHookEvent)

  const paymentId = bodyObj?.id||false
  if(!paymentId)return  res.sendStatus(400)
  const orderId = bodyObj.purchase_units[0].custom_id||false
  if(!orderId)return  res.sendStatus(400);
  const order = await store.shop.getShopOrder(orderId)
  if(!order)return  res.sendStatus(400);
  if(order.paymentId!==paymentId)return {error:"Invalid payment"}

    if(order.status==="success"||order.status==="completed"||order.status==="failed")return res.sendStatus(400)
      order.status="success"
      order.updatedAt=now()
      order.name=bodyObj?.purchase_units[0].payee.email_address
      await store.shop.updateShopOrder(order)
      giveOrder(order)
   

  }

  res.sendStatus(400);
});



router.post('/webhook',webHook)
router.get('/', loggedIn, getItems)
router.post('/checkout', loggedIn,checkOut)

export default router
