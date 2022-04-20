
const doGet = () => {
  return HtmlService.createTemplateFromFile("index.html").evaluate();
};

const include = (filename: string) => {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};


function pipe(...fns: Function[]) {
  return (y: any): any => fns.reduce((prevVal, currFn) => currFn(prevVal), y);
}

interface UserInfo {
  userCode: string
  userName: string
}

function nameTemplate(sep:string) {
  return (userInfo: UserInfo): string => {
    const { userCode, userName } = userInfo;
    return `${userCode}${sep}${userName}`;
  };
}
