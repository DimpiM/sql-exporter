import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';

import { Scrollbars } from 'react-custom-scrollbars-2';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useEffect } from 'react';
import React from 'react';
import {
  setSelectedItems,
  setUniqueKey
} from '../../redux/slice/databaseSlice';
import { useAddUpdateDatabaseMutation } from '@renderer/redux/api/databaseApi';
import { DbColumn } from '../../types/appType';

export const TableOverview = (): JSX.Element  => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const database = useSelector((state: RootState) => state.database);
  const [ addUpdateDatabase ] = useAddUpdateDatabaseMutation();

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [focusedItem, setFocusedItem] = React.useState<DbColumn | null>(null);

  useEffect(() => {
    if(database && database.database4File) {
      addUpdateDatabase(database.database4File);
    }
  }, [database.database4File])

  const handelItemSelectionToggle = (_event, itemId: string, isSelected: boolean) => {
    dispatch(setSelectedItems({itemId, isSelected}))
  }

  const handleSetAsKeyClick = (isKey: boolean) => {
    if(!focusedItem) return

    dispatch(setUniqueKey({
      itemId: focusedItem.id!,
      isKey: isKey
    }))
    setContextMenu(null)
  }

  const handleItemFocus = (_event, itemId: string) => {
    const focusedChild = database.tables!.find(x => x.columns.find(y => y.id === itemId))?.columns.find(x => x.id === itemId)
    setFocusedItem(focusedChild || null)
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null // There is a Description in the MUI documentation https://mui.com/material-ui/react-menu/
    );
  }

  return (
    <Box sx={{p: '0px 12px', height:'100%'}}>
      <Paper sx={{height:'100%', p: '12px 24px'}}
        elevation={8}
      >
        <SimpleTreeView
          sx={{height: '100%'}}
          checkboxSelection
          multiSelect
          selectedItems={database.selectedItems}
          onItemSelectionToggle={handelItemSelectionToggle}
          onItemFocus={handleItemFocus}
        >
        <Scrollbars>
          {database.tables && database.tables.map((table) =>
            <TreeItem key={table.id} itemId={table.id} label={table.name}>
              {table.columns.map((column) =>
                <TreeItem
                  key={column.id}
                  itemId={column.id!}
                  label={
                    <Stack direction="row" spacing={1}>
                      <Typography>{column.name}</Typography>
                      <Typography>{column.type}</Typography>
                      {database.keyItems.find(x => x === column.id) &&
                        <Chip label="unique Key" color="warning" size="small" />
                      }
                    </Stack>
                  }
                  onContextMenu={handleContextMenu}
                />

              )}
            </TreeItem>
          )}
        </Scrollbars>
        </SimpleTreeView>
        {focusedItem &&
          <Menu
            open={contextMenu !== null}
            onClose={() => setContextMenu(null)}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            {!database.keyItems.find(x => x === focusedItem.id) ?
              <MenuItem onClick={() => handleSetAsKeyClick(true)}>{t('tableOverview.setColumnAsKey', {column: focusedItem?.name})}</MenuItem>
            :
              <MenuItem onClick={() => handleSetAsKeyClick(false)}>{t('tableOverview.unsetColumnAsKey', {column: focusedItem?.name})}</MenuItem>
            }
          </Menu>
        }
      </Paper>
    </Box>
  )
}

export default TableOverview
