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
      '/api/enabled-payment-types',
      [await UserService.authHeader()]
    )
    .then((res) => res.data)
