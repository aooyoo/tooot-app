import React, { useCallback, useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import TimelineAvatar from '@components/Timelines/Timeline/Shared/Avatar'
import TimelineHeaderConversation from '@components/Timelines/Timeline/Shared/HeaderConversation'
import TimelineContent from '@components/Timelines/Timeline/Shared/Content'
import { StyleConstants } from '@utils/styles/constants'
import TimelineActions from '@components/Timelines/Timeline/Shared/Actions'

export interface Props {
  item: Mastodon.Conversation
  queryKey: QueryKey.Timeline
  highlighted?: boolean
}
// Unread and mark as unread
const TimelineConversation: React.FC<Props> = ({
  item,
  queryKey,
  highlighted = false
}) => {
  const navigation = useNavigation()

  const conversationOnPress = useCallback(
    () =>
      item.last_status &&
      navigation.navigate('Screen-Shared-Toot', {
        toot: item.last_status
      }),
    []
  )

  const conversationChildren = useMemo(() => {
    return (
      item.last_status && (
        <View
          style={{
            paddingTop: highlighted ? StyleConstants.Spacing.S : 0,
            paddingLeft: highlighted
              ? 0
              : StyleConstants.Avatar.M + StyleConstants.Spacing.S
          }}
        >
          <TimelineContent
            status={item.last_status}
            highlighted={highlighted}
          />
        </View>
      )
    )
  }, [])

  return (
    <View style={styles.conversationView}>
      <View style={styles.header}>
        <TimelineAvatar queryKey={queryKey} account={item.accounts[0]} />
        <TimelineHeaderConversation
          queryKey={queryKey}
          id={item.id}
          account={item.accounts[0]}
          created_at={item.last_status?.created_at}
        />
      </View>

      <Pressable
        onPress={conversationOnPress}
        children={conversationChildren}
      />

      <View
        style={{
          paddingLeft: highlighted
            ? 0
            : StyleConstants.Avatar.M + StyleConstants.Spacing.S
        }}
      >
        <TimelineActions
          queryKey={queryKey}
          status={item.last_status!}
          reblog={false}
          sameAccountRoot={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  conversationView: {
    flex: 1,
    flexDirection: 'column',
    padding: StyleConstants.Spacing.Global.PagePadding
  },
  header: {
    flex: 1,
    width: '100%',
    flexDirection: 'row'
  }
})

export default TimelineConversation
