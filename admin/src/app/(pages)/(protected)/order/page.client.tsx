'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Button,
  Select,
  MenuItem,
} from '@mui/material'
import { fr, enUS } from 'date-fns/locale'
import { format } from 'date-fns'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as lebobeautycoHelper from ':lebobeautyco-helper'
import * as helper from '@/utils/helper'
import { strings as cpStrings } from '@/lang/create-product'
import { strings as commonStrings } from '@/lang/common'
import { strings } from '@/lang/orders'
import * as OrderService from '@/lib/OrderService'
import OrderStatus from '@/components/OrderStatus'
import PaymentType from '@/components/PaymentType'
import DeliveryType from '@/components/DeliveryType'

import { LanguageContextType, useLanguageContext } from '@/context/LanguageContext'
import { CurrencyContextType, useCurrencyContext } from '@/context/CurrencyContext'
import { UserContextType, useUserContext } from '@/context/UserContext'

import styles from '@/styles/order.module.css'

interface OrderFormProps {
  order: lebobeautycoTypes.OrderInfo
}

const OrderForm: React.FC<OrderFormProps> = ({ order }) => {
  const router = useRouter()

  const { language } = useLanguageContext() as LanguageContextType
  const { currency } = useCurrencyContext() as CurrencyContextType
  const { user } = useUserContext() as UserContextType
  const [orderStatus, setOrderStatus] = useState(order.status)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()

      if (!user || !orderStatus) {
        helper.error()
        return
      }

      const status = await OrderService.updateOrder(user._id!, order._id!, orderStatus)

      if (status === 200) {
        router.refresh()
        helper.info(commonStrings.UPDATED)
      } else {
        helper.error()
      }
    } catch (err) {
      helper.error(err)
    }
  }

  const _fr = language === 'fr'
  const _format = lebobeautycoHelper.getDateFormat(language)
  const _locale = _fr ? fr : enUS

  return (
    <div className={styles.container}>
      <form className={styles.order} onSubmit={handleSubmit}>
        <article key={order._id}>
          <div className={styles.order}>
            <div className={styles.orderContent}>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.ID}</span>
                <span>{order._id}</span>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.STATUS}</span>
                <span>
                  <Select
                    variant="standard"
                    value={orderStatus}
                    SelectDisplayProps={{ style: { paddingTop: 0, paddingRight: 24, paddingBottom: 4, paddingLeft: 0 } }}
                    onChange={(e) => {
                      setOrderStatus(e.target.value as lebobeautycoTypes.OrderStatus)
                    }}
                  >
                    {helper.getOrderStatuses().map((status) => (
                      <MenuItem key={status} value={status}><OrderStatus value={status} /></MenuItem>
                    ))}
                  </Select>
                </span>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.PAYMENT_TYPE}</span>
                <span><PaymentType value={(order.paymentType as lebobeautycoTypes.PaymentTypeInfo).name} /></span>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.DELIVERY_TYPE}</span>
                <span><DeliveryType value={(order.deliveryType as lebobeautycoTypes.DeliveryTypeInfo).name} /></span>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.CLIENT}</span>
                <Link href={`/users?s=${(order.user as lebobeautycoTypes.User)._id}`}>

                  <span>{(order.user as lebobeautycoTypes.User).fullName}</span>

                </Link>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.ORDER_ITEMS}</span>
                <div className={styles.orderItems}>
                  {
                    (order.orderItems as lebobeautycoTypes.OrderItem[]).map((orderItem) => (
                      <div key={orderItem._id} className={styles.orderItem}>
                        <div className={styles.orderItemInfo}>
                          <span className={styles.orderItemLabel}>{strings.PRODUCT}</span>
                          <span>
                            <Link
                              href={`/product?p=${(orderItem.product as lebobeautycoTypes.Product)._id}`}
                              className={styles.orderItemText}
                              title={(orderItem.product as lebobeautycoTypes.Product).name}>

                              {(orderItem.product as lebobeautycoTypes.Product).name}

                            </Link>
                          </span>
                        </div>
                        <div className={styles.orderItemInfo}>
                          <span className={styles.orderItemLabel}>{cpStrings.PRICE}</span>
                          <span>{`${lebobeautycoHelper.formatPrice((orderItem.product as lebobeautycoTypes.Product).price, currency, language)}`}</span>
                        </div>
                        <div className={styles.orderItemInfo}>
                          <span className={styles.orderItemLabel}>{commonStrings.QUANTITY}</span>
                          <span>{orderItem.quantity}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.ORDERED_AT}</span>
                <span>{lebobeautycoHelper.capitalize(format(new Date(order.createdAt!), _format, { locale: _locale }))}</span>
              </div>
              <div className={styles.orderInfo}>
                <span className={styles.orderLabel}>{strings.TOTAL}</span>
                <span className={styles.total}>{`${lebobeautycoHelper.formatPrice(order.total, currency, language)}`}</span>
              </div>
            </div>

          </div>

          <div className="buttons">

            <Button
              variant="contained"
              className="btn-primary btn-margin-bottom"
              size="small"
              type="submit"
            >
              {commonStrings.SAVE}
            </Button>

            <Button
              variant="contained"
              className="btn-secondary btn-margin-bottom"
              size="small"
              onClick={async () => {
                router.push('/orders')
              }}
            >
              {commonStrings.CANCEL}
            </Button>
          </div>

        </article>
      </form>
    </div>
  )
}

export default OrderForm
