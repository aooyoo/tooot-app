import Constants from 'expo-constants'
import * as Updates from 'expo-updates'
import * as Sentry from 'sentry-expo'
import log from './log'

const sentry = () => {
  log('log', 'Sentry', 'initializing')
  Sentry.init({
    dsn: Constants.manifest.extra.sentryDSN,
    enableInExpoDevelopment: false,
    debug:
      __DEV__ ||
      ['development'].some(channel => Updates.releaseChannel.includes(channel))
  })
}

export default sentry
