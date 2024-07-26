import { createSlice, PayloadAction } from "@reduxjs/toolkit"
/* import { assign, isEqual } from "lodash";
import { Database } from "../../types/appType" */
import { DatabaseInitState } from "../../types/sliceType"
import { Database, DbTable } from "@renderer/types/appType"
import {
  getSelectedItems,
  getExportSettings4File
} from "./helper"

const initState: DatabaseInitState = {
  connectedDatabase: null,
  connected: false,
  database4File: null,
  tables: null,
  selectedItems: [],
  keyItems: []
}

export const databaseSlice = createSlice({
  name: 'database',
  initialState: initState,
  reducers: {
    setConnectedDatabase: (state, action: PayloadAction<Database | null>) => {
      state.connectedDatabase = action.payload
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setDisconnect: (state) => {
      state.connected = false
      state.tables = null
      state.selectedItems = []
      state.keyItems = []
      state.database4File = null
    },
    setTables: (state, action: PayloadAction<Array<DbTable> | null>) => {
      //assign(state, initState)
      state.tables = action.payload
      if(!state.tables) {
        state.selectedItems = []
        state.keyItems = []
        state.database4File = null
        return
      }

      /*------------------- Set ExportSettings from SettingFile  -------------------*/
      if(!state.connectedDatabase?.exportSettings) return
      const exportSettings = [...state.connectedDatabase.exportSettings]
      for (let exportSetting of exportSettings) {
        const loadedTable = state.tables!.find(x => x.name === exportSetting.table)
        if(!loadedTable) continue
        /*--------- Set selectedColumns ---------*/
        const selectedColumns = loadedTable!.columns.map(x => exportSetting.selectedColumns.find(y => y.name === x.name) ? x.id : null).filter(x => x != null)
        if(selectedColumns.length > 0) {
          state.selectedItems = [...state.selectedItems, ...selectedColumns, loadedTable.id]
        }
        /*--------- Set keyItems ---------*/
        const uniqueColumnKeys = loadedTable.columns.map(x => exportSetting.uniqueColumnKeys.find(y => y.name === x.name) ? x.id : null).filter(x => x != null)
        if(uniqueColumnKeys.length > 0) {
          state.keyItems = [...state.keyItems, ...uniqueColumnKeys]
        }
      }
      /*----------------------------------------------------------------------------*/
      const connectedDatabase = {...state.connectedDatabase}
      connectedDatabase.exportSettings = getExportSettings4File(state.tables, state.selectedItems, state.keyItems)
      state.database4File = connectedDatabase
    },
    setSelectedItems: (state, action: PayloadAction<{itemId: string, isSelected: boolean}>) => {
      state.selectedItems = getSelectedItems([...state.tables!], [...state.selectedItems], action.payload.itemId, action.payload.isSelected)

      if(state.connectedDatabase) {
        const connectedDatabase = {...state.connectedDatabase}
        connectedDatabase.exportSettings = getExportSettings4File(state.tables!, state.selectedItems, state.keyItems)
        state.database4File = connectedDatabase
      }
    },
    setUniqueKey: (state, action: PayloadAction<{itemId: string, isKey: boolean}>) => {
      state.keyItems = action.payload.isKey ?
        [...state.keyItems, action.payload.itemId] :
        state.keyItems.filter(x => x !== action.payload.itemId)

      if(state.connectedDatabase) {
        const connectedDatabase = {...state.connectedDatabase}
        connectedDatabase.exportSettings = getExportSettings4File(state.tables!, state.selectedItems, state.keyItems)
        state.database4File = connectedDatabase
      }
    }
  }
})

export const {
  setConnectedDatabase,
  setConnected,
  setDisconnect,
  setTables,
  setSelectedItems,
  setUniqueKey
} = databaseSlice.actions
