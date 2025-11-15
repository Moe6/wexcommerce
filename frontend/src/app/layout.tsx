import React from 'react'
import { Playfair_Display } from 'next/font/google'

import type { Metadata } from 'next'

import env from '@/config/env.config'

// import 'github-fork-ribbon-css/gh-fork-ribbon.css'

import '@/styles/globals.css'

// Load elegant serif font for fashion brand
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

export const metadata: Metadata = {

  title: env.WEBSITE_NAME,

  description: 'Single Vendor Marketplace',

}

type RootLayoutProps = Readonly<{

  children: React.ReactNode

}>

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (

  <html className={playfairDisplay.variable}>

    <body>

      {/* {

        process.env.NODE_ENV === 'production' &&

        <a

          className="github-fork-ribbon fixed left-bottom"

          href="https://github.com/Moe6/lebobeautyco"

          data-ribbon="Fork me on GitHub"

          title="Fork me on GitHub">Fork me on GitHub

        </a>

      } */}

      {children}

    </body>

  </html>

)

export default RootLayout

