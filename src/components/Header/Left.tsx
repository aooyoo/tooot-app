import Icon from '@components/Icon'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { useMemo } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

export interface Props {
  type?: 'icon' | 'text'
  content?: string
  native?: boolean

  onPress: () => void
}

const HeaderLeft: React.FC<Props> = ({
  type = 'icon',
  content,
  native = true,
  onPress
}) => {
  const { theme } = useTheme()

  const children = useMemo(() => {
    switch (type) {
      case 'icon':
        return (
          <Icon
            color={theme.primaryDefault}
            name={content || 'ChevronLeft'}
            size={StyleConstants.Spacing.M * 1.25}
          />
        )
      case 'text':
        return (
          <Text
            style={[styles.text, { color: theme.primaryDefault }]}
            children={content}
          />
        )
    }
  }, [theme])

  return (
    <Pressable
      onPress={onPress}
      children={children}
      style={[
        styles.base,
        {
          backgroundColor: theme.backgroundOverlayDefault,
          ...(type === 'icon' && {
            height: 44,
            width: 44,
            marginLeft: native ? -9 : 9
          })
        }
      ]}
    />
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },
  text: {
    ...StyleConstants.FontStyle.M
  }
})

export default HeaderLeft
