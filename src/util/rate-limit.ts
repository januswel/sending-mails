const DEFAULT = {
  INTERVAL: 1000,
  NEEDS_TO_CANCEL: true,
}

const doTasksUnderRateLimitPerTime = <Arg, ReturnValue>(
  doTask: (arg: Arg, index: number) => Promise<ReturnValue>,
  rateLimitPerTime: number,
  args: Array<Arg>,
  opts?: {
    interval?: number
    callback?: (result: ReturnValue, arg: Arg, index: number) => void
  },
): Promise<Array<ReturnValue>> =>
  new Promise((resolve, reject) => {
    let iteration = 0
    const results: {
      [index: number]: ReturnValue
    } = {}
    let finishedCounts = 0
    const interval = (opts && opts.interval) || DEFAULT.INTERVAL
    const callback = opts && opts.callback

    const intervalId = setInterval(() => {
      const startIndex = iteration * rateLimitPerTime
      const endIndex = startIndex + rateLimitPerTime
      for (let index = startIndex; index < endIndex && index < args.length; ++index) {
        doTask(args[index], index)
          .then(result => {
            results[index] = result
            if (callback) {
              callback(result, args[index], index)
            }
          })
          .catch(err => {
            clearInterval(intervalId)
            reject(err)
          })
          .finally(() => {
            ++finishedCounts
            if (finishedCounts === args.length) {
              clearInterval(intervalId)
              resolve(convertArray(results))
            }
          })
      }

      ++iteration
    }, interval)
  })
export default doTasksUnderRateLimitPerTime

const convertArray = (src: { [index: number]: any }) => {
  const results = []
  for (let i = 0; i < Object.entries(src).length; ++i) {
    results.push(src[i])
  }
  return results
}
