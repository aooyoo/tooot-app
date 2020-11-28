import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

import constants from 'src/utils/styles/constants'
import { useTheme } from 'src/utils/styles/ThemeManager'

export interface Props {
  onPressFunction: () => void
  icon: string
  text: string
}

const BottomSheetRow: React.FC<Props> = ({ onPressFunction, icon, text }) => {
  const { theme } = useTheme()

  return (
    <Pressable onPress={() => onPressFunction()} style={styles.pressable}>
      <Feather name={icon} color={theme.primary} size={constants.FONT_SIZE_L} />
      <Text style={[styles.text, { color: theme.primary }]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    marginBottom: constants.SPACING_L
  },
  text: {
    fontSize: constants.FONT_SIZE_M,
    lineHeight: constants.FONT_SIZE_L,
    marginLeft: constants.SPACING_S
  }
})

export default BottomSheetRow
