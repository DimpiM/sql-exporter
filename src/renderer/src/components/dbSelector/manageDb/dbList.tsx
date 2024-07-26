import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars-2';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from "@mui/material/Stack";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemIcon from '@mui/material/ListItemIcon';
import StorageIcon from '@mui/icons-material/Storage';

import { AppDispatch, RootState } from '../../../redux/store';
import { setSelectedDatabase } from "../../../redux/slice/manageDbSlice";
import {
  useDatabaseQuery,
  useDeleteDatabaseMutation
} from '../../../redux/api/databaseApi';
import Helper from "../../../components/utils/helper";
import { Database } from "../../../types/appType";

export const DbList = (): JSX.Element  => {
  const { t } = useTranslation();
  const manageDbState = useSelector((state: RootState) => state.manageDb);
  const dispatch = useDispatch<AppDispatch>();
  const {data: databases} = useDatabaseQuery()
  const [ deleteDatabase ] = useDeleteDatabaseMutation();

  const handleSelectListItem = (item: Database) => {
    dispatch(setSelectedDatabase(item));
  }

  const handleDeleteDatabaseClick = () => {
    if(!manageDbState.selectedDatabase) return;

    deleteDatabase(manageDbState.selectedDatabase.id!);
    dispatch(setSelectedDatabase(null));
  }

  const handleAddNewDatabaseClick = () => {
    dispatch(setSelectedDatabase(null));
  }

  return (
    <Stack
      height={'100%'}
      minWidth={200}
      spacing={1}
    >
      <List
        sx={{height: '100%', border: '1px solid', borderColor: 'text.secondary'}}
        subheader={
          <Stack textAlign='center'>
            <Typography variant="subtitle2">{t('manageDb.listHeader')}</Typography>
            <Divider />
          </Stack>
        }
      >
        <Scrollbars>
          {databases?.map((db) =>
            <React.Fragment key={Helper.uniqueId('db_list')}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={manageDbState.selectedDatabase?.id === db.id}
                  onClick={() => handleSelectListItem(db)}
                >
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{my: 0}}
                    primary={db.name}
                    secondary={db.database}
                  />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" />
            </React.Fragment>
          )}
        </Scrollbars>
      </List>
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        spacing={1}
      >
          <Fab
            size="small"
            color="success"
            aria-label="add-new-db-entry"
            disabled={!manageDbState.selectedDatabase}
            onClick={handleAddNewDatabaseClick}
          >
            <AddIcon />
          </Fab>
          <Fab
            size="small"
            color="error"
            aria-label="remove-new-db-entry"
            disabled={!manageDbState.selectedDatabase}
            onClick={handleDeleteDatabaseClick}
          >
            <DeleteIcon />
          </Fab>
        </Stack>
    </Stack>
  )
}

export default DbList
