// promisified rl.question

import * as readline from 'readline'
import * as util from 'util'

const getQuestion = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // KLUDGE
  const q = (rl.question as any) as { [util.promisify.custom]: (question: string) => Promise<string> }

  q[util.promisify.custom] = (question: string) =>
    new Promise<string>(resolve => {
      rl.question(question, input => {
        resolve(input)
      })
    }).finally(() => {
      rl.close()
    })

  return (util.promisify(rl.question) as any) as (q: string) => Promise<string>
}

export default getQuestion
