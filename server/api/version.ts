import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Read package.json to get version
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
    const version = packageJson.version || '0.0.1'
    
    // Get deployment info (Vercel provides these env vars)
    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID?.slice(-8) || 'dev'
    const gitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(-8) || 'local'
    
    // Format: v0.X.X (rev XX)

    return {
      version: version,
      deployment: deploymentId,
      commit: gitCommitSha,
    }
  } catch (error) {
    return {
      version: 'v0.0.2 (rev unknown)',
      error: 'Could not read version'
    }
  }
})