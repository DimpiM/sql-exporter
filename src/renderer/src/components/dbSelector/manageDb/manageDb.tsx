import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import { AppDispatch } from "@renderer/redux/store";
import { setOpenManageDbDialog } from '../../../redux/appSlice';
import DbList from "./dbList";
import DbEntry from "./dbEntry";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  //bgcolor: 'red',
  borderRadius: '24px',
};

export const ManageDb = (): JSX.Element  => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseDialog = () => {
    dispatch(setOpenManageDbDialog(false));
  }
  return (
    <Paper sx={style} elevation={3}>
      <Stack sx={{height: '100%'}}>
        {/* HEADER */}
        <Stack
          minHeight={60}
          direction='row'
          justifyContent={'space-between'}
          alignItems={'center'}
          px={2}
        >
          <Typography variant="h4">
            {t('manageDb.title')}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider variant="middle" />
        {/* ManageDbs */}
        <Stack
          height={'100%'}
          overflow={'hidden'}
          direction='row'
          spacing={2}
          p={2}
        >
          <DbList />
          <DbEntry />
        </Stack>
        <Divider variant="middle" />
        {/* FOOTER */}
        <Stack
          minHeight={60}
          direction='row'
          justifyContent={'flex-end'}
          alignItems={'center'}
          px={2}
        >
          <Button variant="contained" onClick={handleCloseDialog}>
            {t('manageDb.btnFinish')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ManageDb
