import { cpSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'

const skip = new Set([
  'node_modules',
  'dist',
  '.git',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'vite.entry.js',
  'wix-saved',
])

export default defineConfig({
  plugins: [
    {
      name: 'copy-static-site',
      apply: 'build',
      closeBundle() {
        const root = process.cwd()
        const outDir = join(root, 'dist')
        for (const name of readdirSync(root)) {
          if (skip.has(name) || name.startsWith('.')) continue
          cpSync(join(root, name), join(outDir, name), { recursive: true })
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: join(process.cwd(), 'vite.entry.js'),
    },
  },
})
