
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

function formatDate (date: Date) {
  return `${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

const getAnswerSheet = () => {
  const answerSheetId = "122Efncjwc8BKq9tUKNAdPXVwSxDluEcNxNjCH8GaZGo";
  const ss = SpreadsheetApp.openById(answerSheetId);
  const sheetData = ss.getRange("A2:S50").getValues();
  let toStingData = [];
  sheetData
    .filter((line) => !line.slice(2, 4).includes(""))
    .forEach((data) => {
      toStingData.push([
        formatDate(data[0]),
        ...data.splice(1).map((value) => String(value)),
      ]);
    });
  // console.log(reframedData);
  return toStingData;
};
