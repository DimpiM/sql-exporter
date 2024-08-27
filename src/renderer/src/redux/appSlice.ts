import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initState = {
  openManageDbDialog: false,
  openHelpDialog: false,
  exportPath: ''
}
export const appSlice = createSlice({
  name: 'app',
  initialState: initState,
  reducers: {
    setOpenManageDbDialog: (state, action: PayloadAction<boolean>) => {
      state.openManageDbDialog = action.payload
    },
    setOpenHelpDialog: (state, action: PayloadAction<boolean>) => {
      state.openHelpDialog = action.payload
    },
    setExportPath: (state, action: PayloadAction<string>) => {
      state.exportPath = action.payload
    }
  }
})

export const {
  setOpenManageDbDialog,
  setOpenHelpDialog,
  setExportPath
} = appSlice.actions
