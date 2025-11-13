import React from 'react'
import { toast, ToastContent } from 'react-toastify'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import { strings as commonStrings } from '@/lang/common'
import { strings as osStrings } from '@/lang/order-status'
import LocalizedStrings from 'localized-strings'
import * as UserService from '@/lib/UserService'

export const info = (message: string) => {
  toast.info(message)
}

export const infoWithComponent = (component: ToastContent<unknown>) => {
  toast.info(component)
}

export const toastComponentContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }

export const toastComponentTextStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: 20 }

export const toastComponentButtonStyle: React.CSSProperties = { backgroundColor: '#fff', color: '#121212', marginRight: 0 }

export const error = (err?: unknown, message?: string) => {
  if (err && console?.log) {
    console.log(err)
  }
  if (message) {
    toast.error(message)
  } else {
    toast.error(commonStrings.GENERIC_ERROR)
  }
}

export const setLanguage = (strings: LocalizedStrings, language: string) => {
  strings.setLanguage(language)
}

export const getPaymentTypes = () => {
  return [
    lebobeautycoTypes.PaymentType.CreditCard,
    lebobeautycoTypes.PaymentType.Cod, lebobeautycoTypes.PaymentType.WireTransfer,
  ]
}

export const getPaymentType = (paymentType: lebobeautycoTypes.PaymentType, language: string) => {
  setLanguage(commonStrings, language)

  return paymentType === lebobeautycoTypes.PaymentType.CreditCard ? commonStrings.CREDIT_CARD
    : paymentType === lebobeautycoTypes.PaymentType.Cod ? commonStrings.COD
      : paymentType === lebobeautycoTypes.PaymentType.WireTransfer ? commonStrings.WIRE_TRANSFER
        : ''
}

export const getOrderStatuses = () => {
  return [
    lebobeautycoTypes.OrderStatus.Pending,
    lebobeautycoTypes.OrderStatus.Paid,
    lebobeautycoTypes.OrderStatus.Confirmed,
    lebobeautycoTypes.OrderStatus.InProgress,
    lebobeautycoTypes.OrderStatus.Shipped,
    lebobeautycoTypes.OrderStatus.Cancelled,
  ]
}


export const getOrderStatus = (orderStatus: lebobeautycoTypes.OrderStatus, language: string) => {
  setLanguage(osStrings, language)

  return orderStatus === lebobeautycoTypes.OrderStatus.Pending ? osStrings.PENDING
    : orderStatus === lebobeautycoTypes.OrderStatus.Paid ? osStrings.PAID
      : orderStatus === lebobeautycoTypes.OrderStatus.Confirmed ? osStrings.CONFIRMED
        : orderStatus === lebobeautycoTypes.OrderStatus.InProgress ? osStrings.IN_PROGRESS
          : orderStatus === lebobeautycoTypes.OrderStatus.Shipped ? osStrings.SHIPPED
            : orderStatus === lebobeautycoTypes.OrderStatus.Cancelled ? osStrings.CANCELLED
              : ''
}

export const getDeliveryTypes = () => {
  return [
    lebobeautycoTypes.DeliveryType.Shipping,
    lebobeautycoTypes.DeliveryType.Withdrawal,
  ]
}

export const getDeliveryType = (deliveryType: lebobeautycoTypes.DeliveryType, language: string) => {
  setLanguage(commonStrings, language)

  return deliveryType === lebobeautycoTypes.DeliveryType.Shipping ? commonStrings.SHIPPING
    : deliveryType === lebobeautycoTypes.DeliveryType.Withdrawal ? commonStrings.WITHDRAWAL
      : ''
}

export const total = (cartItems: lebobeautycoTypes.CartItem[]) => {
  let total = 0
  for (const item of cartItems) {
    if (!item.product.soldOut) {
      total += item.product.price * item.quantity
    }
  }
  return total
}

/**
 * Verify reCAPTCHA token.
 *
 * @async
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export const verifyReCaptcha = async (token: string): Promise<boolean> => {
  try {
    const ip = await UserService.getIP()
    const status = await UserService.verifyRecaptcha(token, ip)
    const valid = status === 200
    return valid
  } catch (err) {
    error(err)
    return false
  }
}
