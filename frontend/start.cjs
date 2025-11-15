#!/usr/bin/env node
/**
 * Cross-platform start script for Next.js
 * Handles PORT environment variable with default fallback
 */

const { spawn } = require('node:child_process')

// Get PORT from environment or use default 8006
const port = process.env.PORT || '8006'

// Spawn next start command
const nextProcess = spawn('next', ['start', '-H', '0.0.0.0', '-p', port], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

// Handle process exit
nextProcess.on('exit', (code) => {
  process.exit(code || 0)
})

// Handle errors
nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error)
  process.exit(1)
})

