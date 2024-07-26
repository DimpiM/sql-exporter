import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Modal from '@mui/material/Modal';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import {
  useExportPathQuery,
  useUpdateExportPathMutation
} from "../../redux/api/exportPathApi";
import ExportProgress from './exportProgress';
import { openExportProgressDialog } from '@renderer/redux/slice/exportProgressSlice';

export const ExportTables = (): JSX.Element => {
  const { t } = useTranslation();
  const database = useSelector((state: RootState) => state.database);
  const exportProgressState = useSelector((state: RootState) => state.exportProgress);
  const dispatch = useDispatch<AppDispatch>();

  const {data: exportPath} = useExportPathQuery()
  const [ updateExportPath ] = useUpdateExportPathMutation();

  const handleOpenDialog = async () => {
    const dialogResult = await window.api.openDialog()
    if(dialogResult.canceled) return
    //dispatch(setExportPath(dialogResult.filePaths[0]))
    updateExportPath(dialogResult.filePaths[0])
  }

  const handleStartExport = () => {
    if(database.connectedDatabase && database.connected) {
      dispatch(openExportProgressDialog(true))
      //window.api.exportTables('1')
      window.api.exportTables(database.connectedDatabase.id!)
    }
  }

  return (
    <>
      <Stack
        direction='row'
        justifyContent='space-between'
        pb={2}
        px={8}
      >
        <Stack
          sx={{minWidth: '200px', width: '60%'}}
          direction='row'
          alignContent='center'
          spacing={1}
        >
          <TextField
            fullWidth
            label={t('export.path')}
            value={exportPath || ''}
          />

          <Box alignContent='center'>
            <Fab
              size="small"
              color="secondary"
              aria-label="db-settings"
              onClick={handleOpenDialog}
            >
              <FolderOpenIcon />
            </Fab>
          </Box>
        </Stack>
        <Box alignContent='center'>
          <Button
            variant="contained"
            disabled={!(database.connectedDatabase && database.connected)}
            onClick={handleStartExport}
          >
            {t('export.btnStartExport')}
          </Button>
        </Box>
      </Stack>

      <Modal open={exportProgressState.dialogOpen}>
        <Box>
          <ExportProgress />
        </Box>
      </Modal>
    </>
  )
}

export default ExportTables
