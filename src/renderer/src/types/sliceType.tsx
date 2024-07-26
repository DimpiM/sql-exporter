import { ExportProgressApi } from "src/types/apiTypes";
import { Database, DbTable } from "./appType";

export interface FormState {
  dirty: boolean;
  valid: boolean;
  errors: Record<string, (string | Record<string, string>)>;
}

export interface FormDbState {
  isTestConnectionValid: boolean;
}

export interface ManageDbInitState {
  selectedDatabase: Database | null;
  editDatabase: Database;
  form: FormState & FormDbState;
  dbConnection: TestDbConnectionState;
}

export interface TestDbConnectionState {
  isStable: boolean | null;
  isLoading: boolean;
}


export interface DatabaseInitState {
  connectedDatabase: Database | null;
  connected: boolean
  database4File: Database | null;
  tables: Array<DbTable> | null;
  selectedItems: Array<string>;
  keyItems: Array<string>;
}

export interface ExportProgressInitState {
  dialogOpen: boolean;
  exportProgress: ExportProgressApi;
}
