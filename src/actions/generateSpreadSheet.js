import * as exporter from "xlsx"
import { generateFakeColumn } from "./generateFakeData"

export function generateSpreadSheet(columns, sheetLength) {
  const spreadSheetHeaders = []
  // const spreadSheetRows = generateFakeRows(columns, sheetLength)
  const randomRows = []

  columns.forEach(column => {
    randomRows.push(generateFakeColumn(column, sheetLength))
    spreadSheetHeaders.push(column.header)
  });

  const spreadSheetRows = transformArray(randomRows, spreadSheetHeaders)

  console.log({ spreadSheetRows, spreadSheetHeaders })

  // define sheet
  const worksheet = exporter.utils.json_to_sheet(spreadSheetRows);
  const workbook = exporter.utils.book_new();

  // append sheet
  exporter.utils.book_append_sheet(workbook, worksheet, "Dates");

  // define headers
  exporter.utils.sheet_add_aoa(worksheet, [spreadSheetHeaders], { origin: "A1" });

  /* calculate column width */
  // const max_width = columns.reduce((w, r) => Math.max(w, r.name.length), 10);
  // worksheet["!cols"] = [{ wch: max_width }];

  /* create an XLSX file and try to save to Presidents.xlsx */
  exporter.writeFile(workbook, "importadora.xlsx", { compression: true });
}

function transformArray(arr, atributeNames) {
  const result = [];

  if (arr.length === 0) {
    return result;
  }

  const numArrays = arr[0].length;

  for (let i = 0; i < numArrays; i++) {
    const obj = {};

    for (let j = 0; j < arr.length; j++) {
      obj[atributeNames[j]] = arr[j][i];
    }

    result.push(obj);
  }

  return result;
}

// const mapSpreadSheetDataRows = (data, sheetLength) => {
//   const rowsResult = []
//   for (let counter = 0; counter < sheetLength; counter++) {
//     rowsResult.push({
//       [data.header]: `value ${counter}`
//     })
//   }

//   return rowsResult
// }

// const generateFakeRows = (column, sheetLength) => {
//   const data = []
//   for (let i = 0; i < sheetLength; i++) {
//     const fakeRow = {}
//     column.forEach(col => {
//       fakeRow[col.header] = `value ${i}`
//     })
//     data.push(fakeRow)
//   }
//   return data
// }