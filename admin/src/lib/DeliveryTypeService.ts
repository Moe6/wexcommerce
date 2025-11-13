'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

export const getDeliveryTypes = async (): Promise<lebobeautycoTypes.DeliveryTypeInfo[]> => (
  fetchInstance
    .GET(
      '/api/delivery-types',
      [await UserService.authHeader()]
    )
    .then((res) => res.data)
)

/**
 * Update delivery types.
 *
 * @param {lebobeautycoTypes.UpdateDeliveryTypesPayload} data
 * @returns {Promise<number>}
 */
export const updateDeliveryTypes = async (data: lebobeautycoTypes.UpdateDeliveryTypesPayload): Promise<number> => (
  fetchInstance
    .PUT(
      '/api/update-delivery-types',
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
)
