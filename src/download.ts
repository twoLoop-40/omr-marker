interface Url {
	name? : string
	url? : string
}
function downLoad (urlArray: Url[]) {
	const downloadOmrEl = document.querySelector("#downloadOmr")
	!downloadOmrEl 
		? downloadOmrEl
		: downloadOmrEl.addEventListener("click", event => {
		//사진으로 저장하는 부분
			for (let urls of urlArray) {
				let link = document.createElement("a");
				link.download = `${urls.name}`;
				link.href = `${urls.url}`;
				link.click();
				URL.revokeObjectURL(link.href);
			}
		})
}