import analytics from '@components/analytics'
import Button from '@components/Button'
import haptics from '@components/haptics'
import ComponentInstance from '@components/Instance'
import { useNavigation } from '@react-navigation/native'
import {
  getLocalActiveIndex,
  getLocalInstances,
  InstanceLocal,
  updateLocalActiveIndex
} from '@utils/slices/instancesSlice'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useQueryClient } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'

interface Props {
  instance: InstanceLocal
  disabled?: boolean
}

const AccountButton: React.FC<Props> = ({ instance, disabled = false }) => {
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  return (
    <Button
      type='text'
      disabled={disabled}
      style={styles.button}
      content={`@${instance.account.acct}@${instance.uri}${
        disabled ? ' ✓' : ''
      }`}
      onPress={() => {
        haptics('Light')
        analytics('switch_existing_press')
        dispatch(updateLocalActiveIndex(instance))
        queryClient.clear()
        navigation.goBack()
      }}
    />
  )
}

const ScreenMeSwitchRoot: React.FC = () => {
  const { t } = useTranslation('meSwitch')
  const { theme } = useTheme()
  const localInstances = useSelector(getLocalInstances)
  const localActiveIndex = useSelector(getLocalActiveIndex)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps='handled'>
        <View
          style={[styles.firstSection, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.header, { color: theme.primary }]}>
            {t('content.existing')}
          </Text>
          <View style={styles.accountButtons}>
            {localInstances.length
              ? localInstances
                  .slice()
                  .sort((a, b) =>
                    `${a.uri}${a.account.acct}`.localeCompare(
                      `${b.uri}${b.account.acct}`
                    )
                  )
                  .map((instance, index) => {
                    const localAccount = localInstances[localActiveIndex!]
                    return (
                      <AccountButton
                        key={index}
                        instance={instance}
                        disabled={
                          instance.url === localAccount.url &&
                          instance.token === localAccount.token &&
                          instance.account.id === localAccount.account.id
                        }
                      />
                    )
                  })
              : null}
          </View>
        </View>

        <View style={styles.secondSection}>
          <Text style={[styles.header, { color: theme.primary }]}>
            {t('content.new')}
          </Text>
          <ComponentInstance disableHeaderImage goBack />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    ...StyleConstants.FontStyle.M,
    textAlign: 'center',
    paddingVertical: StyleConstants.Spacing.S
  },
  firstSection: {
    marginTop: StyleConstants.Spacing.S,
    marginHorizontal: StyleConstants.Spacing.Global.PagePadding,
    paddingBottom: StyleConstants.Spacing.S,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  secondSection: {
    paddingTop: StyleConstants.Spacing.M
  },
  accountButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: StyleConstants.Spacing.M
  },
  button: {
    marginBottom: StyleConstants.Spacing.M,
    marginRight: StyleConstants.Spacing.M
  }
})

export default ScreenMeSwitchRoot
