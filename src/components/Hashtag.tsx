import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import analytics from './analytics'

export interface Props {
  hashtag: Mastodon.Tag
  onPress?: () => void
  origin?: string
}

const ComponentHashtag: React.FC<Props> = ({
  hashtag,
  onPress: customOnPress,
  origin
}) => {
  const { theme } = useTheme()
  const navigation = useNavigation<
    StackNavigationProp<Nav.LocalStackParamList>
  >()

  const onPress = useCallback(() => {
    analytics('search_account_press', { page: origin })
    navigation.push('Screen-Shared-Hashtag', { hashtag: hashtag.name })
  }, [])

  return (
    <Pressable
      style={[styles.itemDefault, { borderBottomColor: theme.border }]}
      onPress={customOnPress || onPress}
    >
      <Text style={[styles.itemHashtag, { color: theme.primary }]}>
        #{hashtag.name}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  itemDefault: {
    padding: StyleConstants.Spacing.S * 1.5,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemHashtag: {
    ...StyleConstants.FontStyle.M
  }
})

export default ComponentHashtag
