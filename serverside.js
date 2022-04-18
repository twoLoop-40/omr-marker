const doGet = () => {
  return HtmlService.createTemplateFromFile("index.html").evaluate();
}

const include = (filename) => {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

const U = (() => {
  // 함수 연결하기
  return {
    pipe(...fns) {
      return arg => fns.reduce((acc, f) => f(acc), arg);
    },
    // 파일이나 탭의 이름을 만드는 함수
    nameTemplate(sep = "") {
      return ({ userName = "", userCode = "" } = {}) =>
        `${userCode}${sep}${userName}`;
    }
  }
})();