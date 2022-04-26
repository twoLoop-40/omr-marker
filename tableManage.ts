function showLoadingScreen () {
	const loadingEl = document.querySelector('#loading')
	return () => {
		const classes = loadingEl ? loadingEl.classList : null
		if(!classes) return 
		else {
			classes.contains('invisible') 
			? classes.remove('invisible') 
			: classes.add('invisible')
		}
	}
}
// google.script.run promisify
interface WorkQue <T> {
	serverFunction: string
	args: T[]
} 
function asyncRun (serverWork: WorkQue<any>) {
	const { serverFunction, args } = serverWork
	const changeLoadingView = showLoadingScreen()
	changeLoadingView()
	return new Promise((resolve, reject) => {
		google.script.run
			.withSuccessHandler((result: any) => {
				changeLoadingView()
				resolve(result)
			})
			.withFailureHandler((err: Error) => reject(err))
			[serverFunction](...args)
	})
}
/** table 생성 관련 **/
const createNode = ({nodeName = "", className = "", id = "", data = "",}) => {
	const element = document.createElement(nodeName);
	if (className) {
		className.split(" ").forEach(name => element.classList.add(name));
	}
	element.setAttribute("id", id);
	element.innerHTML = data;
	return element;
};
	
const createRows = (obj, count) => {
	const tr = createNode({ nodeName: "tr", className: "studentOmr" })
	/**checkBox 만들기 **/
	const checkBox = createNode({nodeName: "input", className:"form-check-input", id:"flexCheckDefault" });
	checkBox.setAttribute("type","checkbox");
	checkBox.setAttribute("value", count);
	/**checked 관련**/
	checkBox.addEventListener("click", event => {
		console.log(event.target)
	})
	tr.appendChild(checkBox);

	const run = (name, value) => {
		if (typeof(value) == "string"){
			const td = createNode({nodeName: "td", className: name, data:value})
			tr.appendChild(td);
			return
		}
		if (typeof(value) == "object"){
			for (let num of value){
				run(name, num);
			}
		}
	}

	for (let data in obj) {
		run(data, obj[data]);
	}
	
	// /**
	//  * answers 일때 구분 필요
	//  * @type {(names: string[]) => HTMLElement[]}
	//  */
	// const makeTds = (names = Object.keys(obj)) => {
	//   if (typeof names == 'string') {
	//     // if (typeof obj[names] == 'object'){
	//     //   return obj[names].forEach(value => makeTds(names, value))
	//     // }
	//     //names ex)sumbitDate
	//     return [
	//       createNode({nodeName: 'td', className: names, data: obj[names]})
	//     ]
	//   } else {  
	//     // console.log(names)
	//     return names.flatMap(name => makeTds(name))
	//   }
	// }
	
	// /**
	//  * else문에서 각 node들을 재귀함수로 돌려서
	//  * tr에 append함
	//  * @type {(elems: HTMLElemet[]) => HTMLElement}
	//  */
	// const iter = (tr, elems) => {
	//   if (elems.type && elems.type == 'checkbox') {
	//     checkBox.addEventListener("click", event => {
	//       // checkChecked(event.target)
	//     })
	//     tr.appendChild(checkBox)
	//     return tr
	//   } else if (elems.nodeName == 'TD') {
	//     tr.appendChild(elems)
	//     return tr
	//   } 
	//   else return elems.reduce((prevTr, elem) => iter(prevTr, elem), tr)
	// }
 
	// return iter(
	//   createNode({ nodeName: "tr", className: "studentOmr" }),
	//   [checkBox, ...makeTds()]  
	// )
	
	return tr;
};

const makeTableRow = (obj, count) => {
	const tbody = document.querySelector("#omr-results");
	const nodes = createRows(obj, count);
	tbody.appendChild(nodes);
};