import apiGeneral from '@api/general'
import { createAsyncThunk } from '@reduxjs/toolkit'
import i18n from '@root/i18n/i18n'
import { RootState } from '@root/store'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { getInstance, Instance, PUSH_SERVER } from '../instancesSlice'
import androidDefaults from './push/androidDefaults'

export const updateInstancePushDecode = createAsyncThunk(
  'instances/updatePushDecode',
  async (
    disable: boolean,
    { getState }
  ): Promise<Instance['push']['decode']['value']> => {
    const state = getState() as RootState
    const instance = getInstance(state)
    if (!instance?.url || !instance.account.id || !instance.push.keys) {
      return Promise.reject()
    }

    const expoToken = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: '@xmflsct/tooot'
      })
    ).data

    await apiGeneral({
      method: 'post',
      domain: PUSH_SERVER,
      url: 'v1/update-decode',
      body: {
        expoToken,
        instanceUrl: instance.url,
        accountId: instance.account.id,
        ...(disable && { keys: instance.push.keys })
      }
    })

    if (Platform.OS === 'android') {
      const accountFull = `@${instance.account.acct}@${instance.uri}`
      switch (disable) {
        case true:
          Notifications.deleteNotificationChannelAsync(`${accountFull}_default`)
          Notifications.setNotificationChannelAsync(`${accountFull}_follow`, {
            groupId: accountFull,
            name: i18n.t('meSettingsPush:content.follow.heading'),
            ...androidDefaults
          })
          Notifications.setNotificationChannelAsync(
            `${accountFull}_favourite`,
            {
              groupId: accountFull,
              name: i18n.t('meSettingsPush:content.favourite.heading'),
              ...androidDefaults
            }
          )
          Notifications.setNotificationChannelAsync(`${accountFull}_reblog`, {
            groupId: accountFull,
            name: i18n.t('meSettingsPush:content.reblog.heading'),
            ...androidDefaults
          })
          Notifications.setNotificationChannelAsync(`${accountFull}_mention`, {
            groupId: accountFull,
            name: i18n.t('meSettingsPush:content.mention.heading'),
            ...androidDefaults
          })
          Notifications.setNotificationChannelAsync(`${accountFull}_poll`, {
            groupId: accountFull,
            name: i18n.t('meSettingsPush:content.poll.heading'),
            ...androidDefaults
          })
          break
        case false:
          Notifications.setNotificationChannelAsync(`${accountFull}_default`, {
            groupId: accountFull,
            name: i18n.t('meSettingsPush:content.default.heading'),
            ...androidDefaults
          })
          Notifications.deleteNotificationChannelAsync(`${accountFull}_follow`)
          Notifications.deleteNotificationChannelAsync(
            `${accountFull}_favourite`
          )
          Notifications.deleteNotificationChannelAsync(`${accountFull}_reblog`)
          Notifications.deleteNotificationChannelAsync(`${accountFull}_mention`)
          Notifications.deleteNotificationChannelAsync(`${accountFull}_poll`)
          break
      }
    }

    return Promise.resolve(disable)
  }
)
