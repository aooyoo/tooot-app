import Icon from '@components/Icon'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Flow } from 'react-native-animated-spinkit'

export interface Props {
  type?: 'icon' | 'text'
  content: string
  native?: boolean

  loading?: boolean
  disabled?: boolean

  onPress: () => void
}

const HeaderRight: React.FC<Props> = ({
  type = 'icon',
  content,
  native = true,
  loading,
  disabled,
  onPress
}) => {
  const { theme } = useTheme()

  const loadingSpinkit = useMemo(
    () => (
      <View style={{ position: 'absolute' }}>
        <Flow
          size={StyleConstants.Font.Size.M * 1.25}
          color={theme.secondary}
        />
      </View>
    ),
    [theme]
  )

  const children = useMemo(() => {
    switch (type) {
      case 'icon':
        return (
          <>
            <Icon
              name={content}
              style={{ opacity: loading ? 0 : 1 }}
              size={StyleConstants.Spacing.M * 1.25}
              color={disabled ? theme.secondary : theme.primary}
            />
            {loading && loadingSpinkit}
          </>
        )
      case 'text':
        return (
          <>
            <Text
              style={[
                styles.text,
                {
                  color: disabled ? theme.secondary : theme.primary,
                  opacity: loading ? 0 : 1
                }
              ]}
              children={content}
            />
            {loading && loadingSpinkit}
          </>
        )
    }
  }, [theme, loading, disabled])

  return (
    <Pressable
      onPress={onPress}
      children={children}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: theme.backgroundGradientStart,
          ...(type === 'icon' && {
            height: 44,
            width: 44,
            marginRight: native ? -9 : 9
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

export default HeaderRight
