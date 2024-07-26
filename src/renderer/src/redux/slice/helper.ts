import { DbTable, ExportSetting } from "../../types/appType";

export const getSelectedItems = (
  allTables: Array<DbTable>,
  allSelectedItems: Array<string>,
  itemId: string,
  isSelected: boolean
): Array<string> => {
  const table = allTables.find(x => x.id === itemId)
  if(table) {
    // parent
    const columnsId = [...table?.columns.map(x => x.id!), itemId]
    if(isSelected) {
      return [...columnsId, ...allSelectedItems]
    } else {
      return allSelectedItems.filter(x => !columnsId.includes(x))
    }
  } else {
    // must be a child
    const parentItem = allTables.find(x => x.columns.find(y => y.id === itemId))!

    if(isSelected) {
      if(allSelectedItems.find(x => x === parentItem.id)) {
        // parent is already checked
        return [...allSelectedItems, itemId]
      } else {
        // check parentItem and checked child
        return [...allSelectedItems, parentItem.id, itemId]
      }
    } else {
      const childIds = parentItem.columns.map(x => x.id)
      if(allSelectedItems.filter(x => childIds.includes(x)).length > 1) {
        // there are more then one child checked
        // only uncheck item
        return [...allSelectedItems.filter(x => x !== itemId)]
      } else {
        // only one checked child
        // uncheck parent and child
        return [...allSelectedItems.filter(x => ![itemId, parentItem.id].includes(x))]
      }
    }
  }
}

export const getExportSettings4File = (
  allTables: Array<DbTable>,
  selectedItems: Array<string>,
  uniqueKeyItems: Array<string>
): Array<ExportSetting> => {
/*
  table: string,
  selectedColumns: Array<string>,
  uniqueColumnKeys: Array<string>
*/
  const exportSettings: Array<ExportSetting> = []

  for (let table of allTables) {
    const allIdsInTable = [...table.columns.map(x => x.id), table.id]
    const selectedItemsInTable = allIdsInTable.filter(x => selectedItems.includes(x!))
    const uniqueKeyItemsInTable = allIdsInTable.filter(x => uniqueKeyItems.includes(x!))
    if(selectedItemsInTable.length > 0 || uniqueKeyItemsInTable.length > 0) {
      const selectedItemsInTableName = table.columns.filter(x => selectedItemsInTable.includes(x.id)).map(x => { return {name: x.name, type: x.type}})
      const uniqueKeyItemsInTableName = table.columns.filter(x => uniqueKeyItemsInTable.includes(x.id)).map(x => { return {name: x.name, type: x.type}})
      exportSettings.push({
        table: table.name,
        selectedColumns: selectedItemsInTableName,
        uniqueColumnKeys: uniqueKeyItemsInTableName
      })
    }
  }

  return exportSettings
}
