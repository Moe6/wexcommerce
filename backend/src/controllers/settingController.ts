import { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as logger from '../utils/logger'
import i18n from '../lang/i18n'
import * as env from '../config/env.config'
import * as helper from '../utils/helper'
import Setting from '../models/Setting'

/**
 * Initialize settings.
 *
 * @async
 * @returns {Promise<boolean>}
 */
export const init = async () => {
  try {
    const count = await Setting.findOne({}).countDocuments()

    if (count === 0) {
      await new Setting().save()
    }

    return true
  } catch (err) {
    logger.error(`[setting.init] ${i18n.t('DB_ERROR')}`, err)
    return false
  }
}

/**
 * Get language.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const getLanguage = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.findOne({})

    res.json(settings?.language || env.DEFAULT_LANGUAGE)
  } catch (err) {
    logger.error(`[setting.getLanguage] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Get currency.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const getCurrency = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.findOne({})

    res.json(settings?.currency || env.DEFAULT_CURRENCY)
  } catch (err) {
    logger.error(`[setting.getCurrency] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Get currency.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const getStripeCurrency = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.findOne({})

    res.json(settings?.stripeCurrency || env.DEFAULT_STRIPE_CURRENCY)
  } catch (err) {
    logger.error(`[setting.getCurrency] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Get settings.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.findOne({})

    res.json(settings)
  } catch (err) {
    logger.error(`[setting.getSettings] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Get logo settings (public endpoint).
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const getLogoSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.findOne({}).select('logoType logoText logoImageUrl')

    res.json({
      logoType: settings?.logoType || 'text',
      logoText: settings?.logoText || '',
      logoImageUrl: settings?.logoImageUrl || undefined,
    })
  } catch (err) {
    logger.error(`[setting.getLogoSettings] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Update settings.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { language, currency, stripeCurrency, logoType, logoText, logoImageUrl }: lebobeautycoTypes.UpdateSettingsPayload = req.body
    const settings = await Setting.findOne({})

    if (settings) {
      settings.language = language
      settings.currency = currency
      settings.stripeCurrency = stripeCurrency
      
      if (logoType !== undefined) {
        settings.logoType = logoType
      }
      if (logoText !== undefined) {
        settings.logoText = logoText
      }
      if (logoImageUrl !== undefined) {
        // If a new logo image is being set, move it from temp to permanent location
        if (logoImageUrl) {
          const tempPath = path.join(env.CDN_TEMP_LOGO, logoImageUrl)
          if (await helper.pathExists(tempPath)) {
            // Delete old logo if exists
            if (settings.logoImageUrl) {
              const oldLogoPath = path.join(env.CDN_LOGO, settings.logoImageUrl)
              if (await helper.pathExists(oldLogoPath)) {
                await fs.unlink(oldLogoPath).catch(() => {})
              }
            }
            
            const filename = `logo_${nanoid()}_${Date.now()}${path.extname(logoImageUrl)}`
            const newPath = path.join(env.CDN_LOGO, filename)
            
            // Ensure directory exists
            await fs.mkdir(env.CDN_LOGO, { recursive: true }).catch(() => {})
            
            await fs.rename(tempPath, newPath)
            settings.logoImageUrl = filename
          }
        } else {
          // Delete old logo if exists
          if (settings.logoImageUrl) {
            const oldLogoPath = path.join(env.CDN_LOGO, settings.logoImageUrl)
            if (await helper.pathExists(oldLogoPath)) {
              await fs.unlink(oldLogoPath).catch(() => {})
            }
          }
          settings.logoImageUrl = undefined
        }
      }

      await settings.save()

      res.sendStatus(200)
      return
    }

    res.sendStatus(204)
  } catch (err) {
    logger.error(`[setting.updateSettings] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Upload logo image.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const uploadLogoImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error('[setting.uploadLogoImage] req.file not found')
    }

    // Ensure temp directory exists
    await fs.mkdir(env.CDN_TEMP_LOGO, { recursive: true }).catch(() => {})

    const ext = path.extname(req.file.originalname).toLowerCase()
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp']
    
    if (!allowedExtensions.includes(ext)) {
      res.status(400).send('Invalid file type. Allowed: PNG, JPG, SVG, GIF, WEBP')
      return
    }

    const filename = `logo_${nanoid()}_${Date.now()}${ext}`
    const filepath = path.join(env.CDN_TEMP_LOGO, filename)

    await fs.writeFile(filepath, req.file.buffer)
    res.json(filename)
  } catch (err) {
    logger.error(`[setting.uploadLogoImage] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Delete temp logo image.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const deleteTempLogoImage = async (req: Request, res: Response) => {
  try {
    const { filename }: { filename: string } = req.body
    const filepath = path.join(env.CDN_TEMP_LOGO, filename)

    if (await helper.pathExists(filepath)) {
      await fs.unlink(filepath)
    }

    res.sendStatus(200)
  } catch (err) {
    logger.error(`[setting.deleteTempLogoImage] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}

/**
 * Update bank settings.
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {unknown}
 */
export const updateBankSettings = async (req: Request, res: Response) => {
  try {
    const { bankName, accountHolder, rib, iban }: lebobeautycoTypes.UpdateBankSettingsPayload = req.body
    const settings = await Setting.findOne({})

    if (settings) {
      settings.bankName = bankName
      settings.accountHolder = accountHolder
      settings.rib = rib
      settings.iban = iban

      await settings.save()

      res.sendStatus(200)
      return
    }

    res.sendStatus(204)
  } catch (err) {
    logger.error(`[setting.updateBankSettings] ${i18n.t('DB_ERROR')}`, err)
    res.status(400).send(i18n.t('DB_ERROR') + err)
  }
}
