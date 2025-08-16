import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Read package.json to get version
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
    const version = packageJson.version || '0.0.1'
    return {
      version: version,
    }
  } catch (error) {
    return {
      version: '0.0.0',
    }
  }
})