
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useTranslation } from 'react-i18next';

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from '@mui/material/LinearProgress';

interface ModalUpdateAvailableProps {
  onDownloadUpdateClick: () => void;
  onRestartClick: () => void;
}
export const ModalUpdateAvailable = (props: ModalUpdateAvailableProps): JSX.Element => {
  const { t } = useTranslation()

  const updateState = useSelector((state: RootState) => state.updateChecker);
  //const dispatch = useDispatch<AppDispatch>();


  return (
    <Stack
      sx={{ height: '100%' }}
      alignItems={'center'}
    >
      <Typography variant='h4' pb={3}>
        {t('updateChecker.newVersionAvailable')}
      </Typography>
      <Typography>
        {t('updateChecker.newVersion')} {updateState.newVersion}
      </Typography>

      <Stack pt={5}>
        {(updateState.updateStatus === 'available') && (
          <Button
            color='primary'
            variant='contained'
            onClick={props.onDownloadUpdateClick}
          >
            {t('updateChecker.download')}
          </Button>
        )}
        {(updateState.updateStatus === 'downloading') && (
          <>
            <Typography>downloading {updateState.progress.percent}%</Typography>
            <LinearProgress
              sx={{ width: '80%', height: '12px', borderRadius: '6px' }}
              variant="determinate"
              value={updateState.progress.percent} />
          </>
        )}
        {(updateState.updateStatus === 'downloaded') && (
          <>
            <Typography>{t('updateChecker.downloadFinished')}</Typography>
            <Button
              color='primary'
              variant='contained'
              onClick={props.onRestartClick}
            >
              {t('updateChecker.restart')}
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default ModalUpdateAvailable
