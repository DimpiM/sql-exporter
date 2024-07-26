import { promises as fsProm} from 'fs';
import sql from 'mssql'
import { DatabaseApi, SettingsApi } from "../types/apiTypes";

export const getSettingsFile = async (): Promise<SettingsApi> => {
  try {
    await fsProm.readFile('settings.json', { encoding: 'utf8'})
  } catch (err) {
    await fsProm.writeFile('settings.json', JSON.stringify({ exportPath: '', databases: [] }), { encoding: 'utf8' });
  }
  const settingsJson = await fsProm.readFile('settings.json', { encoding: 'utf8'})
  return JSON.parse(settingsJson);
}

export const generateId = (): string => {
  return Math.random().toString(36).replace('0.', '')
}
export const timeout = (ms): Promise<unknown> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getSqlConfig = (dbConfig: DatabaseApi): sql.config => {
  return {
    server: dbConfig.server,
    database: dbConfig.database,
    user: dbConfig.userName,
    password: dbConfig.password,
    options: {
      encrypt: false
    }
  }
}

export const createDbChunks = (totalEntries: number, chunkSize: number): Array<Array<number>> => {
  const chunks: Array<Array<number>> = [];
  // create array with specific length
  const array = Array.apply(null, Array(totalEntries)).map((_x, i) => i+1)
  // create chunks with first and last value
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push([chunk[0], chunk[chunk.length -1]]);
  }
  return chunks;
}

const Helper = {
  getSettingsFile,
  generateId,
  timeout,
  getSqlConfig,
  createDbChunks
}
export default Helper;
