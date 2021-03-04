import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import i18n from '@root/i18n/i18n'
import { RootState, store } from '@root/store'
import * as Analytics from 'expo-firebase-analytics'
import * as Localization from 'expo-localization'
import * as Notifications from 'expo-notifications'
import { pickBy } from 'lodash'
import androidDefaults from './instances/push/androidDefaults'
import { getInstances } from './instancesSlice'

enum availableLanguages {
  'zh-Hans',
  'en'
}

export const changeAnalytics = createAsyncThunk(
  'settings/changeAnalytics',
  async (newValue: SettingsState['analytics']) => {
    await Analytics.setAnalyticsCollectionEnabled(newValue)
    return newValue
  }
)

export type SettingsState = {
  language: keyof availableLanguages
  theme: 'light' | 'dark' | 'auto'
  browser: 'internal' | 'external'
  analytics: boolean
}

export const settingsInitialState = {
  notification: {
    enabled: false
  },
  language: Object.keys(
    pickBy(availableLanguages, (_, key) => Localization.locale.includes(key))
  )
    ? Object.keys(
        pickBy(availableLanguages, (_, key) =>
          Localization.locale.includes(key)
        )
      )[0]
    : 'en',
  theme: 'auto',
  browser: 'internal',
  analytics: true
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: settingsInitialState as SettingsState,
  reducers: {
    changeLanguage: (
      state,
      action: PayloadAction<NonNullable<SettingsState['language']>>
    ) => {
      state.language = action.payload
    },
    changeTheme: (
      state,
      action: PayloadAction<NonNullable<SettingsState['theme']>>
    ) => {
      state.theme = action.payload
    },
    changeBrowser: (
      state,
      action: PayloadAction<NonNullable<SettingsState['browser']>>
    ) => {
      state.browser = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(changeAnalytics.fulfilled, (state, action) => {
      state.analytics = action.payload
    })
  }
})

export const getSettingsLanguage = (state: RootState) => state.settings.language
export const getSettingsTheme = (state: RootState) => state.settings.theme
export const getSettingsBrowser = (state: RootState) => state.settings.browser
export const getSettingsAnalytics = (state: RootState) =>
  state.settings.analytics

export const {
  changeLanguage,
  changeTheme,
  changeBrowser
} = settingsSlice.actions
export default settingsSlice.reducer
