import { ElectronAPI } from '@electron-toolkit/preload'
import { API, EnvVar } from './interface'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API,
    envVar: EnvVar
  }
}
