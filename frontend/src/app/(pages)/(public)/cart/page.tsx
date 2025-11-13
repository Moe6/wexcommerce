import React, { Suspense } from 'react'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as CartService from '@/lib/CartService'
import CartComponent, { EmptyCart } from '@/components/Cart'
import Indicator from '@/components/Indicator'
import ScrollToTop from '@/components/ScrollToTop'

const Cart = async () => {
  let cart: lebobeautycoTypes.Cart | undefined = undefined

  try {
    const cartId = await CartService.getCartId()

    if (cartId) {
      cart = await CartService.getCart(cartId)
    }
  } catch (err) {
    console.error(err)
  }

  return (
    <>
      <ScrollToTop />

      {cart ? (
        <Suspense fallback={<Indicator />}>
          <CartComponent cart={cart} />
        </Suspense>
      ) : (
        <EmptyCart />
      )
      }
    </>
  )
}

export default Cart
