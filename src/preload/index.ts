import { contextBridge, ipcRenderer, OpenDialogReturnValue } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { API, EnvVar } from './interface'
import { DatabaseApi, DbTableApi } from '../types/apiTypes'

// Custom APIs for renderer
const api: API = {
  check4Update: (): Promise<void> => ipcRenderer.invoke('check-update:check-4-update'),
  downloadUpdate: (): Promise<void> => ipcRenderer.invoke('check-update:download-update'),
  installUpdate: (): Promise<void> => ipcRenderer.invoke('check-update:install-update'),

  openDialog: (): Promise<OpenDialogReturnValue> => ipcRenderer.invoke('open-dialog'),
  openFolder: (): Promise<void> => ipcRenderer.invoke('open-folder'),
  openHelp: (): Promise<void> => ipcRenderer.invoke('open-help'),

  getDatabases: (): Promise<Array<DatabaseApi> | null> => ipcRenderer.invoke('get-databases'),
  addUpdateDatabase: (db: DatabaseApi): Promise<boolean> => ipcRenderer.invoke('add-update-database', db),
  deleteDatabase: (id: string): Promise<boolean> => ipcRenderer.invoke('delete-database', id),

  getExportPath: (): Promise<string | null> => ipcRenderer.invoke('get-export-path'),
  updateExportPath: (path: string): Promise<boolean> => ipcRenderer.invoke('update-export-path', path),


  testDbConnection: (dbConfig: DatabaseApi): Promise<boolean> => ipcRenderer.invoke('test-db-connection', dbConfig),
  getDbTables: (dbConfigId: string): Promise<Array<DbTableApi>  | null> => ipcRenderer.invoke('get-db-tables', dbConfigId),
  exportTables: (dbConfigId: string): Promise<boolean> => ipcRenderer.invoke('export-tables', dbConfigId),
}

const envVar: EnvVar = {
  ELECTRON_RENDERER_URL: process.env.ELECTRON_RENDERER_URL,
  test: __dirname
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    console.log('env', process.env.ELECTRON_RENDERER_URL);
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('envVar', envVar)
  } catch (error) {
    console.error(error)
  }
} else {

  console.log('env2', process.env.ELECTRON_RENDERER_URL);
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.envVar = envVar
}
