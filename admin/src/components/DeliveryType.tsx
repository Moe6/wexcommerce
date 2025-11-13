'use client'

import React from 'react'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import { LanguageContextType, useLanguageContext } from '@/context/LanguageContext'
import * as helper from '@/utils/helper'

import styles from '@/styles/delivery-type.module.css'

interface DeliveryTypeProps {
  value: lebobeautycoTypes.DeliveryType
  className?: string
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const DeliveryType: React.FC<DeliveryTypeProps> = (
  { value,
    className,
    onClick
  }) => {
  const { language } = useLanguageContext() as LanguageContextType

  return language && (
    <span
      className={(className ? className + ' ' : '') +
        (value === lebobeautycoTypes.DeliveryType.Shipping ? styles.shipping
          : value === lebobeautycoTypes.DeliveryType.Withdrawal ? styles.withdrawal
            : '')}
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
      }}
    >
      {
        helper.getDeliveryType(value, language)
      }
    </span>
  )
}

export default DeliveryType
