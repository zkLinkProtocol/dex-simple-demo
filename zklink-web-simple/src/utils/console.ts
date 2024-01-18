import { isMainnet, isProduction } from 'config'

if (isMainnet && isProduction) {
  console.debug = () => {}
  console.log = () => {}
}
