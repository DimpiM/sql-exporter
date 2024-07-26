import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { assign } from "lodash";
import { ExportProgressInitState } from "@renderer/types/sliceType"
import { ExportProgressApi } from "src/types/apiTypes"

const initState: ExportProgressInitState = {
  dialogOpen: false,
  exportProgress: {
    tableName: '',
    tableProgress: 0,
    tableTotal: 0,
    rowProgress: 0,
    rowTotal: 1,
    state: 'progress'
  }
}

export const exportProgressSlice = createSlice({
  name: 'exportProgress',
  initialState: initState,
  reducers: {
    openExportProgressDialog: (state, action: PayloadAction<boolean>) => {
      assign(state, initState)
      state.dialogOpen = action.payload
    },
    setExportProgress: (state, action: PayloadAction<ExportProgressApi>) => {
      state.exportProgress = action.payload
    }
  }
})

export const {
  openExportProgressDialog,
  setExportProgress
} = exportProgressSlice.actions
