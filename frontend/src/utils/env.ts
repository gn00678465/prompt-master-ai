const clientEnv = {
  API_URL: import.meta.env.VITE_API_URL || '',
} as const

class EnvManager {
  private static instance: EnvManager
  private envVars: typeof clientEnv

  private constructor() {
    this.envVars = clientEnv
  }

  public static getInstance(): EnvManager {
    if (!EnvManager.instance) {
      EnvManager.instance = new EnvManager()
    }
    return EnvManager.instance
  }

  public get<K extends keyof typeof clientEnv>(key: K): typeof clientEnv[K] {
    return this.envVars[key]
  }

  public getAll() {
    return { ...this.envVars }
  }
}

export const envManager = EnvManager.getInstance()
export const getEnv = <K extends keyof typeof clientEnv>(key: K) => envManager.get(key)
