'use client'

import emailjs from '@emailjs/browser'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import env from '@/config/env.config'

let emailjsInitialized = false

/**
 * Initialize EmailJS with public key
 */
export const initEmailJS = () => {
  if (env.EMAILJS_PUBLIC_KEY && !emailjsInitialized) {
    emailjs.init(env.EMAILJS_PUBLIC_KEY)
    emailjsInitialized = true
  }
}

/**
 * Send an email using EmailJS
 *
 * @param {lebobeautycoTypes.SendEmailPayload} data - Email data
 * @returns {Promise<number>} HTTP status code (200 for success)
 */
export const sendEmail = async (data: lebobeautycoTypes.SendEmailPayload): Promise<number> => {
  try {
    // Initialize EmailJS if not already initialized
    initEmailJS()

    // Prepare template parameters based on EmailJS template structure
    // Adjust these parameter names to match your EmailJS template variables
    const templateParams: Record<string, string> = {
      from_email: data.from,
      email: data.to,
      title: data.isContactForm ? 'Contact Form Submission' : data.subject,
      message: data.message || '',
    }

    // Add contact form specific fields if needed
    if (data.isContactForm) {
      templateParams.contact_subject = data.subject
      templateParams.from_name = data.from.split('@')[0] // Extract name from email if needed
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      env.EMAILJS_SERVICE_ID,
      env.EMAILJS_TEMPLATE_ID,
      templateParams,
      env.EMAILJS_PUBLIC_KEY || undefined
    )

    // EmailJS returns status 200 on success
    return response.status === 200 ? 200 : 400
  } catch (error) {
    console.error('EmailJS error:', error)
    // Return error status
    return 400
  }
}

