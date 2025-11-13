'use client'

import React from 'react'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import { LanguageContextType, useLanguageContext } from '@/context/LanguageContext'
import * as helper from '@/utils/helper'

import styles from '@/styles/order-status.module.css'

interface OrderStatusProps {
  value: lebobeautycoTypes.OrderStatus
  className?: string
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const OrderStatus: React.FC<OrderStatusProps> = (
  {
    value,
    className,
    onClick
  }
) => {
  const { language } = useLanguageContext() as LanguageContextType

  return language && (
    <span
      className={(className ? className + ' ' : '') +
        (value === lebobeautycoTypes.OrderStatus.Pending ? styles.pending
          : value === lebobeautycoTypes.OrderStatus.Paid ? styles.paid
            : value === lebobeautycoTypes.OrderStatus.Confirmed ? styles.confirmed
              : value === lebobeautycoTypes.OrderStatus.InProgress ? styles.inProgress
                : value === lebobeautycoTypes.OrderStatus.Shipped ? styles.shipped
                  : value === lebobeautycoTypes.OrderStatus.Cancelled ? styles.cancelled
                    : '')}
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
      }}
    >
      {
        helper.getOrderStatus(value, language)
      }
    </span>
  )
}

export default OrderStatus
