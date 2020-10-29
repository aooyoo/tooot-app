import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Reblog from './Toot/Reblog'
import Avatar from './Toot/Avatar'
import Header from './Toot/Header'
import Content from './Toot/Content'
import Poll from './Toot/Poll'
import Media from './Toot/Media'
import Card from './Toot/Card'
import Actions from './Toot/Actions'

// Maybe break away notification types? https://docs.joinmastodon.org/entities/notification/

export default function Toot ({ item, notification }) {
  const navigation = useNavigation()

  let actualContent
  if (notification && item.status) {
    actualContent = item.status
  } else if (item.reblog) {
    actualContent = item.reblog
  } else {
    actualContent = item
  }

  const toot = useMemo(() => {
    return (
      <View style={styles.tootTimeline}>
        {item.reblog && (
          <Reblog
            name={item.account.display_name || item.account.username}
            emojis={item.account.emojis}
          />
        )}
        <View style={styles.toot}>
          <Avatar
            uri={actualContent.account.avatar}
            id={actualContent.account.id}
          />
          <View style={styles.details}>
            <Header
              name={
                actualContent.account.display_name ||
                actualContent.account.username
              }
              emojis={actualContent.account.emojis}
              account={actualContent.account.acct}
              created_at={item.created_at}
              application={item.application}
            />
            {/* Can pass toot info to next page to speed up performance */}
            <Pressable
              onPress={() =>
                navigation.navigate('Toot', { toot: actualContent.id })
              }
            >
              {actualContent.content ? (
                <Content
                  content={actualContent.content}
                  emojis={actualContent.emojis}
                  mentions={actualContent.mentions}
                  spoiler_text={actualContent.spoiler_text}
                  tags={actualContent.tags}
                  style={{ flex: 1 }}
                />
              ) : (
                <></>
              )}
              {actualContent.poll && <Poll poll={actualContent.poll} />}
              {actualContent.media_attachments && (
                <Media
                  media_attachments={actualContent.media_attachments}
                  sensitive={actualContent.sensitive}
                  width={Dimensions.get('window').width - 24 - 50 - 8}
                />
              )}
              {actualContent.card && <Card card={actualContent.card} />}
            </Pressable>
            <Actions
              replies_count={actualContent.replies_count}
              reblogs_count={actualContent.reblogs_count}
              reblogged={actualContent.reblogged}
              favourites_count={actualContent.favourites_count}
              favourited={actualContent.favourited}
            />
          </View>
        </View>
      </View>
    )
  })

  return toot
}

const styles = StyleSheet.create({
  tootTimeline: {
    flex: 1,
    flexDirection: 'column',
    padding: 12
  },
  toot: {
    flex: 1,
    flexDirection: 'row'
  },
  details: {
    flex: 1,
    flexGrow: 1
  }
})

Toot.propTypes = {
  item: PropTypes.shape({
    account: PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      display_name: PropTypes.string.isRequired,
      acct: PropTypes.string.isRequired
    }).isRequired,
    created_at: PropTypes.string.isRequired,
    application: PropTypes.exact({
      name: PropTypes.string.isRequired,
      website: PropTypes.string
    }),
    content: PropTypes.string
  }).isRequired,
  notification: PropTypes.bool
}
