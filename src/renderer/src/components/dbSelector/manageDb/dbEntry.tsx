import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Box from "@mui/material/Box";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { AppDispatch, RootState } from '../../../redux/store';
import {
  setDatabaseDatabase,
  setDatabaseName,
  setDatabasePassword,
  setDatabaseServer,
  setDatabaseUserName,
  testDbConnection,
  setSave
} from "../../../redux/slice/manageDbSlice";
import { useAddUpdateDatabaseMutation } from "../../../redux/api/databaseApi";
import { useEffect } from "react";

export const DbEntry = (): JSX.Element  => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const manageDbState = useSelector((state: RootState) => state.manageDb);
  const [ addUpdateDatabase ] = useAddUpdateDatabaseMutation();

  useEffect(() => {
    //console.log('loading',manageDbState.dbConnection.isLoading)
  }, [manageDbState.dbConnection.isLoading])

  const handleSaveDbEntry = () => {
    addUpdateDatabase(manageDbState.editDatabase);
    dispatch(setSave());
  }

  const handleTestDbConnection = () => {
    dispatch(testDbConnection(manageDbState.editDatabase));
  }

  const handleDbEntryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    switch(event.target.name) {
      case 'dbName':
        dispatch(setDatabaseName(event.target.value));
        break;
      case 'dbServer':
        dispatch(setDatabaseServer(event.target.value));
        break;
      case 'dbUserName':
        dispatch(setDatabaseUserName(event.target.value));
        break;
      case 'dbPassword':
        dispatch(setDatabasePassword(event.target.value));
        break;
      case 'dbDatabase':
        dispatch(setDatabaseDatabase(event.target.value));
        break;
      default:
        break;
    }
  }
  return (
    <Scrollbars>
      <Stack
        width={'100%'}
        spacing={2}
        pr={2}
        mt={'6px'}
      >
        <TextField
          name="dbName"
          label={t('manageDb.tbxDisplayName')}
          value={manageDbState.editDatabase?.name}
          onChange={handleDbEntryChange}
        />
        <TextField
          name="dbServer"
          label={t('manageDb.tbxServer')}
          value={manageDbState.editDatabase?.server}
          onChange={handleDbEntryChange}
        />
        <TextField
          name="dbUserName"
          label={t('manageDb.tbxUsername')}
          value={manageDbState.editDatabase?.userName}
          onChange={handleDbEntryChange}
        />
        <TextField
          name="dbPassword"
          label={t('manageDb.tbxPassword')}
          value={manageDbState.editDatabase?.password}
          onChange={handleDbEntryChange}
        />
        <TextField
          name="dbDatabase"
          label={t('manageDb.tbxDatabase')}
          value={manageDbState.editDatabase?.database}
          onChange={handleDbEntryChange}
        />
        <Box>
          <Stack direction='row' justifyContent='space-between'>
            <Button
              variant="contained"
              color="primary"
              disabled={!(manageDbState.form.isTestConnectionValid)}
              onClick={handleTestDbConnection}
            >
              {t('manageDb.btnTestConnection')}
            </Button>
            {manageDbState.dbConnection.isStable === true &&
              <Stack direction="row" alignItems="center">
                <CheckIcon color="success" sx={{mr:1}} />
                <Typography color="success.main" fontWeight="bold">Verbindung hergestellt</Typography>
              </Stack>
            }
            {manageDbState.dbConnection.isStable === false &&
              <Stack direction="row" alignItems="center">
                <CloseIcon color="error" sx={{mr:1}} />
                <Typography color="error.main" fontWeight="bold">Verbindung fehlgeschlagen</Typography>
              </Stack>
            }
            {manageDbState.dbConnection.isLoading &&
              <Stack direction="row" alignItems="center">
                <CircularProgress size={16} sx={{mr:1}} />
                <Typography fontWeight="bold">Verbindung wird geprüft</Typography>
              </Stack>
            }
            <Button
              variant="contained"
              color="primary"
              disabled={!(manageDbState.form.valid && manageDbState.form.dirty)}
              onClick={handleSaveDbEntry}
            >
              {t('manageDb.btnSaveDbEntry')}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Scrollbars>
  )
}

export default DbEntry
