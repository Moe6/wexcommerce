import { toast, ToastContent } from 'react-toastify'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import { strings as commonStrings } from '@/lang/common'
import { strings as osStrings } from '@/lang/order-status'
import LocalizedStrings from 'localized-strings'

export const info = (message: string) => {
  toast.info(message)
}

export const infoWithComponent = (component: ToastContent<unknown>) => {
  toast.info(component)
}

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
