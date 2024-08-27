import Stack from '@mui/material/Stack';
import DbSelector from './components/dbSelector/dbSelector';
import TableOverview from './components/tableOverview/tableOverview';
import ExportTables from './components/exportTables/exportTables';
/* import HelpMain from './components/helperPage/helpMain'; */
import UpdateChecker from './components/updateChecker/updateChecker';

export const App = (): JSX.Element  => {

  return (
      <Stack
        spacing={2}
        height='100vh'
      >
        <UpdateChecker>
          <DbSelector />
          <TableOverview />
          <ExportTables />
        </UpdateChecker>
      </Stack>
  )
}

export default App
