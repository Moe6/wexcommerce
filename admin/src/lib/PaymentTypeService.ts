'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

/**
 * Get all payment types.
 *
 * @returns {*}
 */
export const getPaymentTypes = async (): Promise<lebobeautycoTypes.PaymentTypeInfo[]> =>
  fetchInstance
    .GET(
      '/api/payment-types',
      [await UserService.authHeader()]
    )
    .then((res) => res.data)

/**
 * Update payment types
 *
 * @param {*} data
 * @returns {*}
 */
export const updatePaymentTypes = async (data: lebobeautycoTypes.UpdatePaymentTypesPayload): Promise<number> =>
  fetchInstance
    .PUT(
      '/api/update-payment-types',
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
