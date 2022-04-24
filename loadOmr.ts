function fileToData64 (): (arg: string) => string {
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
  const makeSrc = function ({ mimeType, data64 }) {
    return `data:${mimeType};base64,${data64}`;
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

class Student <T> {
  typeToString (item: T) {
    return typeof item == 'string' ? item : item.toString() 
  }
  dateToString () {
    const date: T = this.studentExamData[0]
    return typeof date == 'string' 
      ? date
      : typeof date == 'number'
      ? date.toString()
      : date instanceof Date
      ? `${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      : null
  }
  getUserCode () {
    return this.typeToString(this.studentExamData[2])
  }
  getUserName () {
    return this.typeToString(this.studentExamData[1])
  }
  getExamCode () {
    return this.typeToString(this.studentExamData[3])
  }
  getAnswers () {
    const examAnswers = this.studentExamData.slice(4, 19)
    const iter = (exams: T | T[]):string[] => {
      if(!Array.isArray(exams)) return [this.typeToString(exams)]
      else { 
        return exams.flatMap(this.getAnswers)
      }
    }
    return iter(examAnswers) 
  }
  constructor(
    public studentExamData: T[]
   ) {}
}
function getWorkingSpreadsheet<T> (): (arg: string) => T {
  const spreadsheetIds = {
    kiwi: '1Z_6B89U_pZCX54F0SP2AczCyiNBErl1p7Wx8k_nVXOc'
  }
  type Iter <T, Q> = {
    (arg: T | T[]) : Q
  }
  const iter: Iter<string, object> = (ssName) => {
    return typeof ssName == 'string' 
      ? { [ssName]: SpreadsheetApp.openById(spreadsheetIds[ssName])}
      : Array.isArray(ssName)
      ? ssName.reduce((spreadsheets, name) => {
        return { ...spreadsheets, ...iter(name) }
      }, {})
      : new Error('Wrong Input!')
  }
  const ssForOut = iter(Object.keys(spreadsheetIds))
  return (ssName: string): T => {
    const spreadsheet = ssForOut[ssName]
    return spreadsheet ? spreadsheet : new Error('No Spreadsheet for ' + `${ssName}`)
  } 
  
}

const spreadsheetsFor = getWorkingSpreadsheet<GoogleAppsScript.Spreadsheet.Spreadsheet>()

function getStudents (ssName: string = 'kiwi') {
  const ss = spreadsheetsFor(ssName)
  const sheet = ss.getSheets()[0]
  type InputForm = string | number | Date
  const students = sheet.getDataRange().getValues().slice(1).map((data) => new Student<InputForm>(data))
  students.forEach(student => console.log(student.getUserName()))
}
// const getAnswerSheet = () => {
//   const answerSheetId = "122Efncjwc8BKq9tUKNAdPXVwSxDluEcNxNjCH8GaZGo";
//   const ss = SpreadsheetApp.openById(answerSheetId);
//   const sheetData = ss.getRange("A2:S50").getValues();
//   let toStingData = [];
//   sheetData
//     .filter((line) => !line.slice(2, 4).includes(""))
//     .forEach((data) => {
//       toStingData.push([
//         formatDate(data[0]),
//         ...data.splice(1).map((value) => String(value)),
//       ]);
//     });
//   // console.log(reframedData);
//   return toStingData;
// };
