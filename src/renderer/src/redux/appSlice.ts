import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initState = {
  openManageDbDialog: false,
  exportPath: ''
}
export const appSlice = createSlice({
  name: 'app',
  initialState: initState,
  reducers: {
    setOpenManageDbDialog: (state, action: PayloadAction<boolean>) => {
      state.openManageDbDialog = action.payload
    },
    setExportPath: (state, action: PayloadAction<string>) => {
      state.exportPath = action.payload
    }
  }
})

export const {
  setOpenManageDbDialog,
  setExportPath
} = appSlice.actions
