import { Component, createEffect, createSignal, createMemo,For,Show } from "solid-js"
import { A, useNavigate } from "@solidjs/router"
import PageHeader from "../../shared/PageHeader"
import Divider from "../../shared/Divider"
import { cartStore } from "../../store"
import { CalendarHeart, Coins, ShoppingCart } from "lucide-solid"
import logo from "../../assets/logo.png"
import Modal from "../../shared/Modal"

import { loadScript } from "@paypal/paypal-js";

const PremiumOptions: Component = () => {
  const items = cartStore((state) => state.items)
  const cartItems = cartStore((state) => state.cartItems)
  const [cartSignal, setCartSignal] = createSignal(cartItems)
  const [orderId, setOrderId] = createSignal(null)
  const navigate = useNavigate()
  const [paypal, setPaypal] = createSignal(null)

  let paypalButtons

  const renderButtons = (id) => {
   
      paypal().Buttons({
        createOrder: function(data, actions) {
          // Set up the transaction details
          return id
        },
        onApprove: function(data, actions) {
          // Capture the payment
          return actions.order.capture().then(function(details) {
            // Show a success message to the buyer
            setOrderId(null)
            navigate('/thankyou')
           // alert('Transaction completed by ' + details.payer.name.given_name + '!');
          });
        }
      }).render(paypalButtons);
  
  }
  
  createEffect(() => {
    cartStore.getItems()
    cartStore.getCartItems()
    loadScript({ "client-id": "AcfzQbmT9qPEf7Ab8lTpKxLGkEI_EG_bmg5DyuECpcliXUjB4DhWEoK_76P_7sqp1GtnQkaqbXiqz7ik","currency":"EUR" }).then((paypalObject) => {
      setPaypal(paypalObject)
    })
  }, { on: cartItems })

  const addToCart = (item) => {
    cartStore.addToCart(item).then(() => {
      cartStore.getCartItems()
      setCartSignal(cartItems)
    })
  }

  const removeFromCart = (item) => {
    cartStore.removeFromCart(item).then(() => {
      cartStore.getCartItems()
      setCartSignal(cartItems)
    })
  }

  const cartTotal = createMemo(() => {
    if(!cartItems?.list || cartItems.list.length<1)return 0.00
    return cartItems.list.reduce((total, item) => {
      return total + item?.price
    }, 0).toFixed(2)
  }, [cartItems])
  
  const checkoutCart = (id) => {
    cartStore.checkoutCart().then(() => {
      const id = cartItems?.orderId || ""
      setOrderId(id)
      console.log(id)
      renderButtons(orderId())
       })
    }

  return (
    <div class="container">
      <PageHeader title="Shop" subtitle="Premium & Credit Options" />
      <section>
       <Show when={!orderId()}>
        <div class="shadow grid grid-cols-1 columns-3 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
         <For each={items.list}>{(item)=>
            <Item
              item={item}
              cartItems={cartSignal()}
              addToCart={addToCart}
             
              removeFromCart={removeFromCart}
            />
         }
          </For>
        </div>
        </Show>
      </section>
      <Divider />

    
        <Show when={cartSignal()?.list?.length > 0 && orderId()  }>
        <h2 class="text-gray-400 text-xl mb-4">Cart</h2>
    
       <section class="flex flex-col gap-4">
        <For each={cartSignal()?.list}>
          {(item) => (
            <div class="flex flex-row justify-between">
              <div class="text-lg font-bold">{item.name}</div>
              <div class="text-lg font-bold">€ {item.price}</div>
            </div>
          )}    
        </For>
        </section>
        <Divider />
        <section class="flex flex-col gap-4">
            <div class="flex flex-row justify-between">
                <div class="text-lg font-bold">Total</div>
                <div class="text-lg font-bold">€ {cartTotal()}</div>
            </div>
           
        </section>
        <Divider />
        </Show>
        <Show when={cartSignal()?.list?.length > 0}>
        <div class="flex flex-row">
            <button class="bg-teal-600 text-white px-4 py-2 rounded-md font-bold" onClick={checkoutCart}><ShoppingCart /> Checkout</button>
        </div>
      </Show>
    <Divider/>
        {orderId() && (
    <section>
        <h2 class="text-gray-400 text-xl mb-4">Checkout</h2>
   
  <div id="paypal-buttons-container" ref={paypalButtons}></div>
 

    </section>
    )}
    

    </div>
  )
}

const Item: Component<{
  item: any
  cartItems: any
  addToCart: any
  removeFromCart: any
}> = (props) => {
  const isItemInCart = () => {
    return props.cartItems.list?.some(
      (cartItem) => cartItem._id === props.item._id
    )
  }

  return (
    <div
      class={`group bg-teal-500 rounded-md p-4 ${
        isItemInCart() ? "opacity-90 cursor-not-allowed bg-yellow-500 text-gray-500" : "cursor-pointer"
      }`}
      onClick={() => {
        if (!isItemInCart()) {
          props.addToCart(props.item)
        } else {
          props.removeFromCart(props.item)
        }
      }}
    >
      <h3 class="mt-1 text-md text-gray-100">
        {props.item?.days ? <CalendarHeart /> : ""}
        {props.item?.credits ? <Coins /> : ""}
        {props.item?.name}
      </h3>
      <p class="mt-1 text-lg font-medium text-gray-200">
        € {props.item?.price}
      </p>
     
    </div>
  )
}

export default PremiumOptions
