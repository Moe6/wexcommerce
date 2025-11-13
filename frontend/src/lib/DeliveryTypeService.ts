'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

export const getDeliveryTypes = async (): Promise<lebobeautycoTypes.DeliveryTypeInfo[]> => (
  fetchInstance
    .GET(
      '/api/enabled-delivery-types',
      [await UserService.authHeader()]
    )
    .then((res) => res.data)
)
