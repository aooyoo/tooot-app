export default {
  heading: 'Push Notification',
  content: {
    enable: {
      direct: 'Enable push notification',
      settings: 'Enable in settings'
    },
    global: {
      heading: 'Enable push notification',
      description: "Messages are routed through tooot's server"
    },
    decode: {
      heading: 'Show message details',
      description:
        "Messages routed through tooot's server are encrypted, but you can choose to decode the message on the server. Our server source code is open source, and no log policy."
    },
    default: {
      heading: 'Default' // Android notification channel name only
    },
    follow: {
      heading: 'New follower'
    },
    favourite: {
      heading: 'Favourited'
    },
    reblog: {
      heading: 'Boosted'
    },
    mention: {
      heading: 'Mentioned you'
    },
    poll: {
      heading: 'Poll updates'
    },
    howitworks: 'Learn how routing works'
  },
  error: {
    message: 'Push service error',
    description: 'Please re-enable push notification in settings'
  }
}
