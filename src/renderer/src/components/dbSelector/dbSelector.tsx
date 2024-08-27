import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ManageDb from './manageDb/manageDb';

import {
  useDatabaseQuery,
  useLazyTablesQuery
} from '../../redux/api/databaseApi';
import { AppDispatch, RootState } from '../../redux/store';
import { setOpenHelpDialog, setOpenManageDbDialog } from '../../redux/appSlice';

import { Database } from '../../types/appType';
import {
  setConnectedDatabase,
  setConnected,
  setDisconnect,
  setTables
} from '../../redux/slice/databaseSlice';
import HelpMain from '@renderer/pages/helpMain';

export const DbSelector = (): JSX.Element  => {
  const { t } = useTranslation();
  const {data: databases, isLoading: isDatabasesLoading} = useDatabaseQuery()
  const [getDatabases, { data: tables }] = useLazyTablesQuery();
  const appState = useSelector((state: RootState) => state.app);
  const databaseState = useSelector((state: RootState) => state.database);
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenManageDbDialog = () => {
    dispatch(setOpenManageDbDialog(true));
  }

  const handleDbChange = (_event, value: Database | null) => {
    dispatch(setConnectedDatabase(value));
  };

  const handleConnectClick = () => {
    if(databaseState.connectedDatabase){
      getDatabases(databaseState.connectedDatabase.id!);
      dispatch(setConnected(true));
    }
  }

  const handleDisconnectClick = () => {
    dispatch(setDisconnect());
  }

  const handleOpenHelpClick = () => {
    //window.api.openHelp();
    dispatch(setOpenHelpDialog(true));
  }

  useEffect(() => {
    if(tables){
      dispatch(setTables(tables))
    }
  },[tables])

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        pt={2}
      >
        <Autocomplete
          sx={{ minWidth: 200, width: '40%' }}
          disablePortal
          id="db-selector"
          disabled={databaseState.connected}
          options={databases || []}
          getOptionKey={(option) => option.id!}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={handleDbChange}
          loading={isDatabasesLoading}
          noOptionsText={t('dbSelector.noDbText')}
          renderInput={({ inputProps, ...rest }) =>
            <TextField
              {...rest}
              label={t('dbSelector.dbSelectText')}
              inputProps={{ ...inputProps, readOnly: true }}
            />
          }
        />
        <Box px={1} alignContent='center'>
          {!databaseState.connected ?
            <Button
              sx={{mr: 1}}
              variant="contained"
              disabled={!databaseState.connectedDatabase || databaseState.connected}
              onClick={handleConnectClick}
            >
              {t('dbSelector.btnConnect')}
            </Button>
          :
            <Button
              sx={{mr: 1}}
              variant="contained"
              color="error"
              disabled={!databaseState.connectedDatabase || !databaseState.connected}
              onClick={handleDisconnectClick}
            >
              {t('dbSelector.btnDisconnect')}
            </Button>
          }
          <Fab
            size="small"
            color="secondary"
            aria-label="db-settings"
            onClick={handleOpenManageDbDialog}
          >
            <SettingsIcon />
          </Fab>
        </Box>
        <Stack
          sx={{position: 'absolute', width: '100%', top: '-4px'}}
          alignItems='flex-end'
        >
          <IconButton
            color="primary"
            aria-label="info"
            size='large'
            onClick={handleOpenHelpClick}
          >
            <InfoIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      </Stack>

      <Modal open={appState.openManageDbDialog}>
        <Box>
          <ManageDb />
        </Box>
      </Modal>

      <Modal open={appState.openHelpDialog}>
        <Box>
          <HelpMain />
        </Box>
      </Modal>
    </>
  )
}

export default DbSelector
