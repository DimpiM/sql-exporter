export enum ApiEndpoints {
  GET_DATABASES = 'getDatabases',
  ADD_UPDATE_DATABASE = 'addUpdateDatabase',
  DELETE_DATABASE = 'deleteDatabase',

  GET_EXPORT_PATH = 'getExportPath',
  UPDATE_EXPORT_PATH = 'updateExportPath',

  GET_DB_TABLES = 'getDbTables',
}

export interface SettingsApi {
  exportPath: string
  databases: Array<DatabaseApi>
}
export interface DatabaseApi {
  id: string | null,
  name: string
  server: string
  userName: string
  password: string,
  database: string,
  exportSettings: Array<ExportSettingsApi> | null
}
export interface ExportSettingsApi {
  table: string,
  selectedColumns: Array<DbColumnApi>,
  uniqueColumnKeys: Array<DbColumnApi>
}

export interface DbTableApi {
  id: string
  name: string
  columns: Array<DbColumnApi>
}

export interface DbColumnApi {
  id?: string
  name: string,
  type: string
}

export interface ExportProgressApi {
  tableName: string,
  tableProgress: number,
  tableTotal: number,
  rowProgress: number,
  rowTotal: number,
  state: 'progress' | 'done'
}
