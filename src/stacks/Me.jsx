import React from 'react'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'

import Base from './Me/Base'
import Authentication from 'src/stacks/Me/Authentication'

const Stack = createNativeStackNavigator()

export default function Me () {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Me-Base' component={Base} />
      <Stack.Screen
        name='Me-Authentication'
        component={Authentication}
        options={{
          stackPresentation: 'modal'
        }}
      />
    </Stack.Navigator>
  )
}
