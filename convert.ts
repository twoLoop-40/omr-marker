import * as fs from "fs/promises"
import * as path from 'path'
import * as shell from 'shelljs'

const fileName: string = process.argv[2]

function makeJsFileSrc (): Promise<string> {
	type OneArg <T> = {
		(arg: T): T
	}	
	const getPath: OneArg<string> = (fileName) => {
		return path.join('./src', fileName)
	}
	const tsName = getPath(fileName)
	shell.exec(`tsc ${tsName}`)
	const jsName = extChange(tsName, 'js')
	return fs.readFile(jsName, 'utf8')
}

function extChange (fileName: string, ext: string): string {
	const [dirName, baseName] = [path.dirname(fileName), path.basename(fileName, 'ts')]
	return path.join(dirName, baseName + `${ext}`)	
}

function makeHtmlFile (jsSource: Promise<string>, fileName: string) {
	type HeadTail = [string, string]
	const attatchWords = (src: string, item: HeadTail) => {
		return item[0] + '\n' + src + '\n' + item[1]
	}
	const sendSource = (src: string, destination: string) => {
		const longName = extChange(
			path.join(destination, fileName),
			'html')
		fs.writeFile(longName, src)
			.then(() => console.log('HTML made!'))
			.then(() => fs.unlink(extChange(path.join('./src', fileName), 'js')))
			.then(() => console.log('js file deleted'))
			.catch((err: Error) => console.error(err))
	}

	jsSource.then((source: string) => attatchWords(source, ['<script>', '</script>']))
		.then((source: string) => sendSource(source, './dist'))
}

function makeHtml () {
	const jsSrc = makeJsFileSrc()	
	makeHtmlFile(jsSrc, fileName)
}
makeHtml()