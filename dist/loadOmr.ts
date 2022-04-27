type NormalFunction <T> = {
  (arg: T): T
}
function fileToData64 (): NormalFunction<string> {
  const loadFileFromId = (fileId: string) => {
    return DriveApp.getFileById(fileId);
  };
  const changeFileToBytes = (file: GoogleAppsScript.Drive.File) => {
    return file.getBlob().getBytes();
  };
  const encode64 = (bytes: number[]) => {
    return Utilities.base64Encode(bytes);
  };
  const getMimeType = (file: GoogleAppsScript.Drive.File) => {
    return file.getMimeType();
  };
  interface Source {
    mimeType: string
    data64: number
  }
  const makeSrc = function (source: Source) {
    const { mimeType, data64 } = source
    return `${mimeType};base64,${data64}`
  };

  return (fileId: string): string => {
    const data64 = pipe(loadFileFromId, changeFileToBytes, encode64)(fileId);
    const mimeType = getMimeType(loadFileFromId(fileId));
    console.log(typeof makeSrc({ mimeType, data64 }));
    return makeSrc({ mimeType, data64 });
  };
};

function fileDataToClient (fileId: string) {
  const worker: (arg: string) => string = fileToData64();
  return worker(fileId);
};


function getWorkingSpreadsheet () {
  type NameAndId = {
    [key: string]: string
  }
  const spreadsheetIds: NameAndId = {
    kiwi: '1Z_6B89U_pZCX54F0SP2AczCyiNBErl1p7Wx8k_nVXOc'
  }
  interface spreadsheetMap {
    [key: string]: GoogleAppsScript.Spreadsheet.Spreadsheet
  }
  type Iter <T, Q> = {
    (arg: T | T[]) : Q
  }
  
  const iter: Iter<string, spreadsheetMap> = (ssName) => {
    return typeof ssName == 'string' 
      ? { [ssName]: SpreadsheetApp.openById(spreadsheetIds[ssName])}
      : Array.isArray(ssName)
      ? ssName.reduce((spreadsheets, name) => {
        return { ...spreadsheets, ...iter(name) }
      }, {})
      : new Error('Wrong Input!')
  }
  const ssForOut = iter(Object.keys(spreadsheetIds))
  return (ssName: string) => {
    return ssForOut[ssName]
  }   
}

const spreadsheetsFor = getWorkingSpreadsheet()
type AnswerSheetData = string | number | Date
function getAnswerSheetData (ssName: string = 'kiwi'): AnswerSheetData[][] {
  const ss = spreadsheetsFor(ssName)
  const sheet = ss.getSheets()[0]
  return sheet.getDataRange().getValues().slice(1)
}