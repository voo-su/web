import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist/index.html')
const minifyHTML = (html) => html.replace(/\n/g, '')
  .replace(/\s{2,}/g, ' ')
  .replace(/>\s+</g, '><')
  .replace(/<!--.*?-->/g, '')

fs.writeFileSync(
  filePath,
  minifyHTML(fs.readFileSync(filePath, 'utf-8'))
)
