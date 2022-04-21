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

type InputData = Date | string | number
class Student {
  public studentExamData: InputData[]
  typeToString (item: InputData) {
    if (typeof item == 'string') return item 
    else return item.toString()
  }
  dateToString () {
    const date: InputData = this.studentExamData[0]
    if (typeof date == 'string') return date
    if (typeof date == 'number') return date.toString()
    else {
      return `${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }  
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
    const iter = (exams: InputData | InputData[]) => {
      if(!Array.isArray(exams)) return [this.typeToString(exams)]
      else { 
        return exams.flatMap(this.getAnswers)
      }
    }
    return iter(examAnswers) 
  }
  constructor(examData: InputData[]) {
    this.studentExamData = examData
  }
}
function getWorkingSpreadsheet () {
  const spreadsheetIds = {
    kiwi: '1Z_6B89U_pZCX54F0SP2AczCyiNBErl1p7Wx8k_nVXOc'
  }
  
}

function getStudents (id: string) {
  
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
