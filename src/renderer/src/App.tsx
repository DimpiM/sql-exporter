import Stack from '@mui/material/Stack';
import DbSelector from './components/dbSelector/dbSelector';
import TableOverview from './components/tableOverview/tableOverview';
import ExportTables from './components/exportTables/exportTables';
import { Route, Routes } from 'react-router-dom';
import HelpMain from './components/helperPage/helpMain';

export const App = (): JSX.Element  => {

  return (
      <Stack
        spacing={2}
        height='100vh'
      >
      <Routes>
        <Route path="/" element={
          <>
            <DbSelector />
            <TableOverview />
            <ExportTables />
          </>
        } />
        <Route path="/help" element={<HelpMain />} />
      </Routes>


      </Stack>
  )
}

export default App
