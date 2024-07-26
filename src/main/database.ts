import sql from 'mssql'
import sqlPoolManager from './sqlPoolManager';
import { DatabaseApi } from '../types/apiTypes';
import Helper from './helper';

export const closeSqlConnection = async (): Promise<void> => {
  await sqlPoolManager.closeAll();
}


export const testSqlConnection = async (dbConfig: DatabaseApi): Promise<boolean> => {
  try {
    await sqlPoolManager.get('default', Helper.getSqlConfig(dbConfig));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const getDbTableEntityCount = async (dbConfig: DatabaseApi, tableName: string): Promise<number | null> => {
  try {
    const pool = await sqlPoolManager.get('default', Helper.getSqlConfig(dbConfig));
    const queryString = `SELECT COUNT(1) AS COUNT FROM ${tableName}`;
    const result = await pool.request().query(queryString);

    return result.recordset[0]['COUNT'];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const getDbTables = async (dbConfig: DatabaseApi): Promise<sql.IRecordSet<any> | null> => {
  try {
    const pool = await sqlPoolManager.get('default', Helper.getSqlConfig(dbConfig));
    const queryString = `
    select T.name AS TABLE_NAME,
      C.name AS COLUMN_NAME,
      P.name AS DATA_TYPE
    from sys.objects as T
      join sys.columns as C on T.object_id = C.object_id
      join sys.types as P on C.system_type_id = P.system_type_id
    where T.type_desc = 'USER_TABLE'
      AND T.name <> 'sysdiagrams'
      AND P.name <> 'sysname'
    order by TABLE_NAME, C.column_id`;
    const result = await pool.request().query(queryString);

    if(result.recordset.length <= 0) {
      return null;
    }

    return result.recordset;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const getDbTableEntries = async (dbConfig: DatabaseApi, tableName: string, startChunk: number, endChunk: number): Promise<sql.IRecordSet<any> | null> => {
  //const conn = await sql.connect(Helper.getSqlConfig(dbConfig));
  const pool = await sqlPoolManager.get('default', Helper.getSqlConfig(dbConfig));
  const queryString = `
  WITH RESULT_TABLE AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS ROW_ID FROM ${tableName}
  )
    SELECT * FROM RESULT_TABLE WHERE ROW_ID BETWEEN ${startChunk} AND ${endChunk}
  `
  //const result = await sql.query(queryString);
  const result = await pool.request().query(queryString);

  if(!result || result.recordset.length <= 0) {
    return null;
  }

  return result.recordset;
}



const Database = {
  testSqlConnection,
  closeSqlConnection,
  getDbTableEntityCount,
  getDbTables,
  getDbTableEntries
}
export default Database;
