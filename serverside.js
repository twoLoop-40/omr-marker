// @ts-check

const doGet = () => {
  return HtmlService.createTemplateFromFile("index.html").evaluate();
};

const include = (filename) => {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

/**
 * @type {(...fn: Function[]) => (arg: any) => any}
 */
function pipe(...fns) {
  return (y) => fns.reduce((prevVal, currFn) => currFn(prevVal), y);
}

/**
 * @type {(sep: string) => (userInfo: {userName: string, userCode: string}) => string }
 */
function nameTemplate(sep) {
  return (userInfo) => {
    const { userCode, userName } = userInfo;
    return `${userCode}${sep}${userName}`;
  };
}
