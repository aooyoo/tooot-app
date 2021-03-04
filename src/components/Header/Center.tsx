import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

export interface Props {
  content: string
  inverted?: boolean
}

// Used for Android mostly
const HeaderCenter = React.memo(
  ({ content, inverted = false }: Props) => {
    const { theme } = useTheme()

    return (
      <Text
        style={[
          styles.text,
          { color: inverted ? theme.primaryOverlay : theme.primary }
        ]}
        children={content}
      />
    )
  },
  () => true
)

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: StyleConstants.Font.Weight.Bold
  }
})

export default HeaderCenter
