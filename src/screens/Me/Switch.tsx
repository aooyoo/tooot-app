import { HeaderLeft, HeaderRight } from '@components/Header'
import React from 'react'
import { StyleSheet } from 'react-native'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import ScreenMeSwitchRoot from './Switch/Root'

const Stack = createNativeStackNavigator()

const ScreenMeSwitch: React.FC = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerHideShadow: true }}>
      <Stack.Screen
        name='Screen-Me-Switch-Root'
        component={ScreenMeSwitchRoot}
        options={{
          headerTitle: '切换账号',
          headerLeft: () => (
            <HeaderLeft content='X' onPress={() => navigation.goBack()} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})

export default ScreenMeSwitch