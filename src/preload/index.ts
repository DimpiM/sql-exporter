import { contextBridge, ipcRenderer, OpenDialogReturnValue } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { API } from './interface'
import { DatabaseApi, DbTableApi } from '../types/apiTypes'

// Custom APIs for renderer
const api: API = {
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

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
