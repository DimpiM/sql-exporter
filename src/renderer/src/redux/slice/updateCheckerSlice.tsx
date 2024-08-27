import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UpdateCheckerInitState } from "@renderer/types/sliceType"

const initState: UpdateCheckerInitState = {
  updateStatus: 'not-available',
  //updateStatus: 'downloaded',
  newVersion: '',
  progress: {
    percent: 0,
    bytesPerSecond: 0
  }
}

export const updateCheckerSlice = createSlice({
  name: 'updateChecker',
  initialState: initState,
  reducers: {
    setUpdateAvailable: (state, action: PayloadAction<string>) => {
      state.updateStatus = 'available'
      state.newVersion = action.payload
    },
    setUpdateDownloading: (state, action: PayloadAction<{percent: number, bytesPerSecond: number}>) => {
      state.updateStatus = 'downloading'
      state.progress.percent = action.payload.percent
      state.progress.bytesPerSecond = action.payload.bytesPerSecond
    },
    setUpdateFinished: (state) => {
      state.updateStatus = 'downloaded'
    }
  }
})

export const {
  setUpdateAvailable,
  setUpdateDownloading,
  setUpdateFinished
} = updateCheckerSlice.actions
