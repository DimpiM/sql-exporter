export interface Database {
  id: string | null;
  name: string;
  server: string;
  userName: string;
  password: string;
  database: string;
  exportSettings: Array<ExportSetting> | null
}
export interface ExportSetting {
  table: string,
  selectedColumns: Array<DbColumn>,
  uniqueColumnKeys: Array<DbColumn>
}

export interface DbTable {
  id: string
  name: string
  columns: Array<DbColumn>
}

export interface DbColumn {
  id?: string
  name: string,
  type: string
}
