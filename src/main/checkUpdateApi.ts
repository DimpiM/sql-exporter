import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater, ProgressInfo, UpdateInfo } from 'electron-updater'

export const CheckUpdateApi = (mainWindow: BrowserWindow | null): void=> {
  ipcMain.handle('check-update:check-4-update', async (): Promise<void> => {
    autoUpdater.checkForUpdates();
  });

  ipcMain.handle('check-update:download-update', async (): Promise<void> => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.handle('check-update:install-update', async (): Promise<void> => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on("update-not-available", (info: UpdateInfo) => {
    mainWindow?.webContents.send('check-update:update-not-available', info);
  });

  autoUpdater.on("update-available", (info) => {
    mainWindow?.webContents.send('check-update:update-available', info);
  });

  autoUpdater.on("download-progress", (progress: ProgressInfo) => {
    mainWindow?.webContents.send('check-update:download-progress', progress);
  });

  autoUpdater.on("update-downloaded", (info) => {
    mainWindow?.webContents.send('check-update:update-downloaded', info);
  });

  autoUpdater.on("error", (info) => {
    mainWindow?.webContents.send('check-update:error', info);
  });
}
