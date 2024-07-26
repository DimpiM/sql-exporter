import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from './interface'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
