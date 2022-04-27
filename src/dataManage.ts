/** 데이터를 가져와서 table를 만들고 정리한 데이터객체를 반환 **/
const getAnswerData = async() => {
	const answerData = await asyncRun({ serverFunction: "getAnswerSheet" });
	const answerObject = []
	//시트 정보를 잘라주는 역할을 하는 함수
	const formatData = data => {
		return {
			sumbitDate: data[0],
			userName: data[1],
			userCode: data[2],
			examCode: data[3],
			answers: data.slice(4),
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
