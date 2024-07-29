import { OpenDialogReturnValue } from "electron";
import { DatabaseApi, DbTableApi } from "../types/apiTypes";

export interface API {
  check4Update: () => Promise<void>,
  downloadUpdate: () => Promise<void>,
  installUpdate: () => Promise<void>,

  openDialog: () => Promise<OpenDialogReturnValue>,
  openFolder: () => Promise<void>,
  openHelp: () => Promise<void>,

  getDatabases: () => Promise<Array<DatabaseApi> | null>
  addUpdateDatabase: (db: DatabaseApi) => Promise<boolean>
  deleteDatabase: (id: string) => Promise<boolean>

  getExportPath: () => Promise<string | null>
  updateExportPath: (path: string) => Promise<boolean>,


  testDbConnection: (dbConfig: DatabaseApi) => Promise<boolean>,
  getDbTables: (dbConfigId: string) => Promise<Array<DbTableApi>  | null>,
  exportTables: (dbConfigId: string) => Promise<boolean>
}


