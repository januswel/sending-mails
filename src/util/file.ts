import * as fs from 'fs'

const loadFile = (path: string): string => fs.readFileSync(path).toString()
export default loadFile
