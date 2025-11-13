'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

/**
 * Get current language.
 *
 * @returns {Promise<string>}
 */
export const getLanguage = async (): Promise<string> =>
  fetchInstance
    .GET(
      '/api/language'
    )
    .then((res) => res.data)

/**
 * Get current currency.
 *
 * @returns {Promise<string>}
 */
export const getCurrency = async (): Promise<string> =>
  fetchInstance
    .GET(
      '/api/currency'
    )
    .then((res) => res.data)

/**
 * Get settings.
 *
 * @returns {Promise<lebobeautycoTypes.Setting>}
 */
export const getSettings = async (): Promise<lebobeautycoTypes.Setting> =>
  fetchInstance
    .GET(
      '/api/settings',
      [await UserService.authHeader()]
    )
    .then((res) => res.data)

/**
 * Update settings.
 *
 * @param {lebobeautycoTypes.UpdateSettingsPayload} data
 * @returns {Promise<number>}
 */
export const updateSettings = async (data: lebobeautycoTypes.UpdateSettingsPayload): Promise<number> =>
  fetchInstance
    .PUT(
      '/api/update-settings',
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Update bank settings.
 *
 * @param {lebobeautycoTypes.UpdateBankSettingsPayload} data
 * @returns {Promise<number>}
 */
export const updateBankSettings = async (data: lebobeautycoTypes.UpdateBankSettingsPayload): Promise<number> =>
  fetchInstance
    .PUT(
      '/api/update-bank-settings',
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
