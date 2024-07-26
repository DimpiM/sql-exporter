import './exportProgress.css'
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import { useEffect } from "react";
import { ExportProgressApi } from "src/types/apiTypes";
import {
  openExportProgressDialog,
  setExportProgress
} from '@renderer/redux/slice/exportProgressSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '30%',
  //bgcolor: 'red',
  borderRadius: '24px',
};

export const ExportProgress = (): JSX.Element => {
  const { t } = useTranslation();
  const exportProgressState = useSelector((state: RootState) => state.exportProgress);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window.electron.ipcRenderer.on('table-export', tableExportEvent);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('export-progress');
    }
  },[]);

  const tableExportEvent = (_event: any, arg: ExportProgressApi) => {
    dispatch(setExportProgress(arg));
  }

  const handleOpenFolder = () => {
    window.api.openFolder();
  }

  const handleCloseDialog = () => {
    dispatch(openExportProgressDialog(false));
  }

  if(!exportProgressState.exportProgress) {
    return <></>
  }

  if(exportProgressState.exportProgress.state === 'done') {
    return (
      <Paper sx={style} elevation={3}>
        <Stack
          height="100%"
          alignItems="center"
          justifyContent="center"
          py={2}
        >
          <Typography variant='h6' pb={2}>
            {t('export.progress.successfullyFinished')}
          </Typography>
          <div className="check-container">
            <div className="check-background">
              <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 25L27.3077 44L58.5 7" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* <div className="check-shadow"></div> */}
          </div>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="contained"
              color='secondary'
              onClick={handleOpenFolder}
            >
              {t('export.progress.openFolder')}
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseDialog}
            >
              {t('export.progress.close')}
            </Button>
          </Stack>

        </Stack>
      </Paper>
    )
  }

  return (
    <Paper sx={style} elevation={3}>
      <Stack
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant='h6' pb={2}>
          {t('export.progress.tableInfo', {
            tableName: exportProgressState.exportProgress.tableName,
            tableProgress: exportProgressState.exportProgress.tableProgress,
            tableCount: exportProgressState.exportProgress.tableTotal
          })}
        </Typography>
        <LinearProgress
          sx={{width: '80%', height: '12px', borderRadius: '6px'}}
          variant="determinate"
          value={(exportProgressState.exportProgress.rowProgress / exportProgressState.exportProgress.rowTotal) * 100} />
        <Typography variant='subtitle1'>{t('export.progress.rowInfo', {
            rowProgress: exportProgressState.exportProgress.rowProgress,
            rowCount: exportProgressState.exportProgress.rowTotal
          })}
        </Typography>
      </Stack>
    </Paper>
  )
}
export default ExportProgress
