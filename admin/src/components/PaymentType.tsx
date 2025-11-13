'use client'

import React from 'react'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import { LanguageContextType, useLanguageContext } from '@/context/LanguageContext'
import * as helper from '@/utils/helper'

import styles from '@/styles/payment-type.module.css'

interface PaymentTypeProps {
  value: lebobeautycoTypes.PaymentType
  className?: string
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const PaymentType: React.FC<PaymentTypeProps> = (
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
        (value === lebobeautycoTypes.PaymentType.CreditCard ? styles.creditCard
          : value === lebobeautycoTypes.PaymentType.Cod ? styles.cod
            : value === lebobeautycoTypes.PaymentType.WireTransfer ? styles.wireTransfert
              : '')
      }
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
      }}
    >
      {
        helper.getPaymentType(value, language)
      }
    </span>
  )
}

export default PaymentType
