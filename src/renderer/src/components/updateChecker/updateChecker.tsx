import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useSnackbar, closeSnackbar, OptionsObject } from 'notistack'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { AppDispatch, RootState } from '../../redux/store';
import { setUpdateAvailable, setUpdateDownloading, setUpdateFinished } from '@renderer/redux/slice/updateCheckerSlice';
import { ProgressInfo, UpdateInfo } from 'electron-updater';

export const UpdateChecker = (): JSX.Element  => {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const update = useSelector((state: RootState) => state.updateChecker);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window.electron.ipcRenderer.on('check-update:update-not-available', checkUpdateNotAvailableHandler);
    window.electron.ipcRenderer.on('check-update:update-available', checkUpdateAvailableHandler);
    window.electron.ipcRenderer.on('check-update:download-progress', checkUpdateDownloadProgressHandler);
    window.electron.ipcRenderer.on('check-update:update-downloaded', checkUpdateDownloadedHandler);
    window.electron.ipcRenderer.on('check-update:error', checkUpdateErrorHandler);
    return () => {
      window.electron.ipcRenderer.removeAllListeners('check-update:update-not-available');
      window.electron.ipcRenderer.removeAllListeners('check-update:update-available');
      window.electron.ipcRenderer.removeAllListeners('check-update:download-progress');
      window.electron.ipcRenderer.removeAllListeners('check-update:update-downloaded');
      window.electron.ipcRenderer.removeAllListeners('check-update:error');
    }
  }, []);

  useEffect(() => {
    window.api.check4Update();
  }, [])

  const checkUpdateNotAvailableHandler = (_event: any, arg: UpdateInfo) => {
    console.log('not available', arg)
    // I don't want to notify user if no update available
  }

  const checkUpdateAvailableHandler = (_event: any, arg: UpdateInfo) => {
    console.log('available', arg)
    dispatch(setUpdateAvailable(arg.version))
    //enqueueSnackbar(updateAvailable(), {...snackbarOptions, key: 'foo', persist: false})
  }

  const checkUpdateDownloadProgressHandler = (_event: any, arg: ProgressInfo) => {
    console.log('download Progress', arg)
    dispatch(setUpdateDownloading({percent: arg.percent, bytesPerSecond: arg.bytesPerSecond}))
  }

  const checkUpdateDownloadedHandler = (_event: any, arg: UpdateInfo) => {
    console.log('download finish', arg)
    dispatch(setUpdateFinished())
  }

  const checkUpdateErrorHandler = (_event: any, arg) => {
    console.log('error updater', arg)
  }

  useEffect(() => {
    closeSnackbar()
    if (['available', 'downloading', 'downloaded'].includes(update.updateStatus)) {
      enqueueSnackbar(getSnackbarContent(), {...snackbarOptions, key: update.updateStatus})
    }
  }, [update.updateStatus])

  const closeSnackbarElement = (): JSX.Element => {
    return (
        <IconButton color="inherit" onClick={handleCloseSnackbar}><CloseIcon /></IconButton>
    )
  }

  const snackbarOptions : OptionsObject<"info"> = {
    variant: 'info',
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    persist: true,
    preventDuplicate: true,
    action: closeSnackbarElement
  }

  const handleCloseSnackbar = () => {
    closeSnackbar()
  }

  const handleDownloadUpdate = () => {
    console.log('Download update')
    window.api.downloadUpdate();
  }

  const handleRestartUpdate = () => {
    console.log('Restart')
    window.api.installUpdate();
  }

  const getSnackbarContent = () => {
    if(update.updateStatus === 'available') {
      return (
        <Stack
          direction="row"
          alignItems={'center'}
          spacing={2}
        >
          <Typography>{t('updateChecker.available', {version: update.newVersion})}</Typography>
          <Button
            color='success'
            variant='contained'
            onClick={handleDownloadUpdate}
          >
            {t('updateChecker.download')}
          </Button>
        </Stack>
      )
    }
    if(update.updateStatus === 'downloading') {
      return(
        <Typography>Downloading...</Typography>
      )
    }
    if(update.updateStatus === 'downloaded') {
      return (
        <Stack
          direction="row"
          alignItems={'center'}
          spacing={2}
        >
          <Typography>{t('updateChecker.downloadFinished')}</Typography>
          <Button
            color='success'
            variant='contained'
            onClick={handleRestartUpdate}
          >
            {t('updateChecker.restart')}
          </Button>
        </Stack>
      )
    }

    return(<></>)
  }

  return (<Outlet />)
}

export default UpdateChecker
