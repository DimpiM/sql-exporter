import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { assign, isEqual } from "lodash";
import { Database } from "../../types/appType"
import { ManageDbInitState } from "../../types/sliceType"

const initState: ManageDbInitState = {
  selectedDatabase: null,
  editDatabase: {
    id: null,
    name: '',
    server: '',
    userName: '',
    password: '',
    database: '',
    exportSettings: null
  },
  form: {
    dirty: false,
    valid: true,
    isTestConnectionValid: false,
    errors: {}
  },
  dbConnection: {
    isStable: null,
    isLoading: false
  }
}

const compare = (selectedDatabase: Database | null, editDatabase: Database) => {
  if(!selectedDatabase) {
    return false
  }
  return isEqual(selectedDatabase, editDatabase)
}

const isValid = (editDatabase: Database): boolean => {
  return editDatabase.name !== '';
}
const isDbConnectionValid = (editDatabase: Database): boolean => {
  return editDatabase.server !== '' && editDatabase.database !== ''
}

export const testDbConnection = createAsyncThunk(
  'manageDb/testDbConnection',
  async (dbConfig: Database): Promise<boolean> => {
    const response = await window.api.testDbConnection(dbConfig)
    return response
  }
)

export const manageDbSlice = createSlice({
  name: 'manageDb',
  initialState: initState,
  reducers: {
    setSelectedDatabase: (state, action: PayloadAction<Database | null>) => {
      assign(state, initState)
      if(action.payload !== null) {
        const newDbInfo = { ...action.payload }
        state.selectedDatabase = newDbInfo
        state.editDatabase = newDbInfo

        state.form = {...state.form, valid: isValid(newDbInfo), isTestConnectionValid: isDbConnectionValid(newDbInfo)}
        //state.form.isTestConnectionValid = isDbConnectionValid(newDbInfo)
      }
    },
    setDatabaseName: (state, action: PayloadAction<string>) => {
      state.editDatabase.name = action.payload

      state.form.valid = isValid(state.editDatabase)
      state.form.dirty = !compare(state.selectedDatabase, state.editDatabase)
      state.form.isTestConnectionValid = isDbConnectionValid(state.editDatabase)
    },
    setDatabaseServer: (state, action: PayloadAction<string>) => {
      state.editDatabase.server = action.payload

      state.form.valid = isValid(state.editDatabase)
      state.form.dirty = !compare(state.selectedDatabase, state.editDatabase)
      state.form.isTestConnectionValid = isDbConnectionValid(state.editDatabase)
      state.dbConnection.isStable = null
    },
    setDatabaseUserName: (state, action: PayloadAction<string>) => {
      state.editDatabase.userName = action.payload

      state.form.valid = isValid(state.editDatabase)
      state.form.dirty = !compare(state.selectedDatabase, state.editDatabase)
      state.form.isTestConnectionValid = isDbConnectionValid(state.editDatabase)
      state.dbConnection.isStable = null
    },
    setDatabasePassword: (state, action: PayloadAction<string>) => {
      state.editDatabase.password = action.payload

      state.form.valid = isValid(state.editDatabase)
      state.form.dirty = !compare(state.selectedDatabase, state.editDatabase)
      state.form.isTestConnectionValid = isDbConnectionValid(state.editDatabase)
      state.dbConnection.isStable = null
    },
    setDatabaseDatabase: (state, action: PayloadAction<string>) => {
      state.editDatabase.database = action.payload

      state.form.valid = isValid(state.editDatabase)
      state.form.dirty = !compare(state.selectedDatabase, state.editDatabase)
      state.form.isTestConnectionValid = isDbConnectionValid(state.editDatabase)
      state.dbConnection.isStable = null
    },
    setSave: (state, _action: PayloadAction<void>) => {
      assign(state.selectedDatabase, state.editDatabase)
      state.form.valid = isValid(state.editDatabase)
      state.form.dirty = !compare(state.selectedDatabase, state.editDatabase)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(testDbConnection.pending, (state) => {
      state.dbConnection.isLoading = true
    })
    builder.addCase(testDbConnection.fulfilled, (state, action) => {
      state.dbConnection.isLoading = false
      state.dbConnection.isStable = action.payload
    })
  }
})

export const {
  setSelectedDatabase,
  setDatabaseName,
  setDatabaseServer,
  setDatabaseUserName,
  setDatabasePassword,
  setDatabaseDatabase,
  setSave
} = manageDbSlice.actions
