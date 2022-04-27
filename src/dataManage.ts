/** 데이터를 가져와서 table를 만들고 정리한 데이터객체를 반환 **/
class Student <T> {
  typeToString (item: T) {
    return typeof item == 'string' ? item : String(item) 
  }
  dateToString (time?: number): string | Error {
    const date: T = this.studentExamData[0]
    return typeof date == 'string' 
      ? date
      : typeof date == 'number'
      ? date.toString()
      : date instanceof Date
      ? this.dateToString(date.getTime())
      : new Error('Wrong Type')
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
  getSubmitTime () {
    return this.dateToString()
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

const getAnswerData = async() => {
	type AnswerSheetData = string | number | Date
	const answerData = await asyncRun<unknown, AnswerSheetData[][]>({ serverFunction: "getAnswerSheet" });
	const students = answerData.map((studentData: AnswerSheetData[]) => new Student<AnswerSheetData>(studentData))
	const answerObject = []
	//시트 정보를 잘라주는 역할을 하는 함수
	const formatData = (student: Student<AnswerSheetData>) => {
		return {
			sumbitDate: student.getSubmitTime(),
			userName: student.getUserName(),
			userCode: student.getUserCode(),
			examCode: student.getExamCode(),
			answers: student.getAnswers(),
		};
	};
	let count = 0
	answerData.forEach(line => {
		line = formatData(line)
		answerObject.push(line)
		makeTableRow(line, count);
		count++
	})

	return answerObject
}

getAnswerData().then(
	markOmr
).then(downLoad)
  
  // //checked 된 정보만 불러오기 
  //   const checkChecked = (eventTarget) => {
  //     const checkboxs = document.querySelector(".form-check-input");
  //     const is_checked = checkboxs.checked;
  //     console.log(checkBoxs)
  //     console.log(is_checked)
  //   }

  // document.querySelector("#downloadOmr").addEventListener("click", event => {
  //   .then(
  //     markOmr
  //   ).then(download)
  // })
