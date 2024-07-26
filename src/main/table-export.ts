import { IRecordSet } from "mssql";
import { DbColumnApi, ExportProgressApi, ExportSettingsApi } from "../types/apiTypes";
import Database from "./database";
import Helper from "./helper";
import fs from 'fs';

const dbResultChunks: number = 10;
const fileResultChunks: number = 500;
let tempFileSizeCount: {tableName: string, entryCount: number, fileCount: number} = {tableName: '', entryCount: 0, fileCount: 0};

export const run = async (event: Electron.IpcMainInvokeEvent, dbConfigId: string): Promise<void> => {
  const settings = await Helper.getSettingsFile();
  const dbConfig = settings.databases.find((db) => db.id === dbConfigId)!;
  const tables2Export = dbConfig.exportSettings?.filter(x=> x.selectedColumns.length > 0);

  for(const [index, table] of tables2Export!.entries()) {
    const entriesCount = await Database.getDbTableEntityCount(dbConfig, table.table);
    const dbChunks = Helper.createDbChunks(entriesCount!, dbResultChunks);

    event.sender.send('table-export', buildExportProgressModel(table.table, index +1, tables2Export!.length, 0, entriesCount!));
    for(const dbChunk of dbChunks) {
      const entries = await Database.getDbTableEntries(dbConfig, table.table, dbChunk[0], dbChunk[1]);
      writeToFile(settings.exportPath, table, entries!);
      event.sender.send('table-export', buildExportProgressModel(table.table, index +1, tables2Export!.length, dbChunk[1], entriesCount!));
      //await Helper.timeout(3500);
    }


    /* for(let entry of entries!) {
      const sqlQuery = `INSERT INTO ${table.table} (${table.selectedColumns.join(',')}) VALUES (${table.selectedColumns.map((col) => entry[col]).join(',')})`;
      fs.appendFileSync(settings.exportPath + '/' + table.table + '.sql', sqlQuery + '\n');
      console.log(sqlQuery);
    } */
  }
  event.sender.send('table-export', buildExportProgressModel('', 0, 0, 0, 1, 'done'));
  await Database.closeSqlConnection();
  tempFileSizeCount = {tableName: '', entryCount: 0, fileCount: 0};
}

const writeToFile = (filePath: string, tableSetting: ExportSettingsApi, entries: IRecordSet<any>): void => {
  if(tempFileSizeCount.tableName !== tableSetting.table) {
    tempFileSizeCount = {tableName: tableSetting.table, entryCount: 0, fileCount: 0};
  } else {
    if(tempFileSizeCount.entryCount >= fileResultChunks) {
      tempFileSizeCount.fileCount++;
      tempFileSizeCount.entryCount = 0;
    }
  }

  const fileName = `${filePath}/${tableSetting.table}_${tempFileSizeCount.fileCount +1}.sql`;
  let sqlQuery = '';
  for(let entry of entries) {
    sqlQuery += `IF EXISTS (SELECT 1 FROM ${tableSetting.table} WHERE ${tableSetting.uniqueColumnKeys.map(col => `${col.name} = ${checkValueFormat(col, entry[col.name])}`).join(' AND ')}) BEGIN` + '\n';
    sqlQuery += createUpdateQuery(tableSetting, entry);
    sqlQuery += 'END ELSE BEGIN' + '\n';
    sqlQuery += createInsertQuery(tableSetting, entry);
    sqlQuery += 'END' + '\n';
  }
  fs.appendFileSync(fileName, sqlQuery);

  tempFileSizeCount.entryCount = tempFileSizeCount.entryCount + entries.length;
}

const createInsertQuery = (tableSetting: ExportSettingsApi, entry: IRecordSet<any>): string => {
  return `  \
INSERT INTO ${tableSetting.table} \
(${tableSetting.selectedColumns.map(x => x.name).join(',')}) \
VALUES (${tableSetting.selectedColumns.map((col) => checkValueFormat(col, entry[col.name])).join(',')})` + '\n';
}

const createUpdateQuery = (tableSetting: ExportSettingsApi, entry: IRecordSet<any>): string => {
  return `  \
UPDATE ${tableSetting.table} \
SET ${tableSetting.selectedColumns.map((col) => {
  return !tableSetting.uniqueColumnKeys.map(x => x.name).includes(col.name) ?
    `${col.name} = ${checkValueFormat(col, entry[col.name])}` :
    null
}).filter(x=>x).join(',')} \
WHERE ${tableSetting.uniqueColumnKeys.map(col => `${col.name} = ${checkValueFormat(col, entry[col.name])}`).join(' AND ')}` + '\n';
}

const checkValueFormat = (columnSettings: DbColumnApi, value: any): any => {
  if(['bit'].includes(columnSettings.type)) {
    return value ? 1 : 0;
  }
  if(value == '') {
    return `''`;
  }
  if(!value) {
    return 'null';
  }
  if(['nvarchar', 'uniqueidentifier', 'xml'].includes(columnSettings.type)) {
    return `'${value.replaceAll("'", "''")}'`;
  }
  if(['datetime', 'date'].includes(columnSettings.type)) {
    const returnValue = new Date(value).toISOString();
    return `'${returnValue}'`;
  }
  if(['time'].includes(columnSettings.type)) {
    const returnValue = new Date(value).toISOString().substring(11,19);
    return `'${returnValue}'`;
  }
  return value;
}

const buildExportProgressModel = (
  tableName: string,
  tableProgress: number,
  tableTotal: number,
  rowProgress: number,
  rowTotal: number,
  state: 'progress' | 'done' = 'progress'
):ExportProgressApi => {
  return {
    tableName,
    tableProgress,
    tableTotal,
    rowProgress,
    rowTotal,
    state
  }
}

const TableExport = {
  run
}
export default TableExport;
