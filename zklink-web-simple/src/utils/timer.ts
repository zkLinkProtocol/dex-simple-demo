export const timer = (fn: any, delay: number) => {
  let time: any = null
  const run = () => {
    fn()
    time = setTimeout(() => {
      run()
    }, delay)
  }
  run()
  return () => {
    clearTimeout(time)
  }
}
