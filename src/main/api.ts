import { ipcMain, dialog, OpenDialogReturnValue, shell, BrowserWindow } from 'electron'
import fs, { promises as fsProm} from 'fs';
//import sql from 'mssql'
import { DatabaseApi, DbTableApi, } from "../types/apiTypes";
import Helper from './helper';

import Database from './database';
import TableExport from './table-export';
import { join } from 'path';

export const ApiController = (): void=> {
  ipcMain.handle('test-db-connection', async (_event, dbConfig: DatabaseApi): Promise<boolean> => {
    const returnValue = await Database.testSqlConnection(dbConfig)
    await Database.closeSqlConnection();
    return returnValue;
  });

  ipcMain.handle('get-db-tables', async (_event, dbConfigId: string): Promise<Array<DbTableApi> | null> => {
    const settings = await Helper.getSettingsFile();
    const dbConfig = settings.databases.find((db) => db.id === dbConfigId);
    const tables = await Database.getDbTables(dbConfig!);
    if(!tables) {
      return null;
    }
    const returnTables: Array<DbTableApi> = [];
    for (let tableName of [...new Set(tables.map((table) => table.TABLE_NAME))]) {
      returnTables.push({
        id: Helper.generateId(),
        name: tableName,
        columns: tables.filter((table) => table.TABLE_NAME === tableName).map((table) => {
          return {
            id: Helper.generateId(),
            name: table.COLUMN_NAME,
            type: table.DATA_TYPE
          }
        })
      });
    }
    await Database.closeSqlConnection();
    return returnTables;
  });

  ipcMain.handle('export-tables', async (event: Electron.IpcMainInvokeEvent, dbConfigId: string): Promise<boolean> => {
    await TableExport.run(event, dbConfigId);
    return true;
  });

  ipcMain.handle('open-dialog', async (): Promise<OpenDialogReturnValue>  => {
    const settings = await Helper.getSettingsFile();
    const dir = await dialog.showOpenDialog({
      defaultPath: settings.exportPath,
      properties: ['openDirectory']
    });
    return dir;
  });

  ipcMain.handle('open-folder', async (): Promise<void> => {
    const settings = await Helper.getSettingsFile();
    shell.openPath(settings.exportPath);
  });

  ipcMain.handle('open-help', (event: Electron.IpcMainInvokeEvent): void => {

    const win = new BrowserWindow({
      width: 400,
      height: 300,
      parent: BrowserWindow.getFocusedWindow()!,
    });
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/help');
    /* if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/help');
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'))
    } */
  });

  ipcMain.handle('get-export-path', async(): Promise<string | null> => {
    const settings = await Helper.getSettingsFile();

    if(settings.exportPath !== '' && !fs.existsSync(settings.exportPath)) {
      settings.exportPath = '';
      await fsProm.writeFile('settings.json', JSON.stringify(settings), { encoding: 'utf8' });
    }
    return settings.exportPath || null;
  });

  ipcMain.handle('update-export-path', async(_event, args: string): Promise<boolean> => {
    try {
      const settings = await Helper.getSettingsFile();
      settings.exportPath = args;
      await fsProm.writeFile('settings.json', JSON.stringify(settings), { encoding: 'utf8' });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  });


  ipcMain.handle('get-databases', async(): Promise<Array<DatabaseApi> | null> => {
    const settings = await Helper.getSettingsFile();
    return settings.databases || null;
  });

  ipcMain.handle('add-update-database', async (_event, args: DatabaseApi): Promise<boolean> => {
    try {
      const settings = await Helper.getSettingsFile();

      if(!args.id) {
        args.id = Helper.generateId();
        settings.databases.push(args);
      } else {
        settings.databases = settings.databases.map((db) => {
          var returnValue = {...db};
          if(db.id === args.id) {
            returnValue = args;
          }
          return returnValue;
        });
      }
      await fsProm.writeFile('settings.json', JSON.stringify(settings), { encoding: 'utf8' });
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  });

  // args: database id
  ipcMain.handle('delete-database', async (_event, args: string): Promise<boolean> => {
    const settings = await Helper.getSettingsFile();

    settings.databases = settings.databases.filter((db) => db.id !== args);
    await fsProm.writeFile('settings.json', JSON.stringify(settings), { encoding: 'utf8' });
    return true;
  });
}


