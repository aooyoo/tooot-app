import { useNavigation } from '@react-navigation/native'
import addInstance from '@utils/slices/instances/add'
import { Instance } from '@utils/slices/instancesSlice'
import * as AuthSession from 'expo-auth-session'
import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'

export interface Props {
  instanceDomain: string
  // Domain can be different than uri
  instance: Mastodon.Instance
  appData: Instance['appData']
  goBack?: boolean
}

const InstanceAuth = React.memo(
  ({ instanceDomain, instance, appData, goBack }: Props) => {
    const redirectUri = AuthSession.makeRedirectUri({
      native: 'tooot://instance-auth',
      useProxy: false
    })

    const navigation = useNavigation()
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: appData.clientId,
        clientSecret: appData.clientSecret,
        scopes: ['read', 'write', 'follow', 'push'],
        redirectUri
      },
      {
        authorizationEndpoint: `https://${instanceDomain}/oauth/authorize`
      }
    )
    useEffect(() => {
      ;(async () => {
        if (request?.clientId) {
          await promptAsync()
        }
      })()
    }, [request])
    useEffect(() => {
      ;(async () => {
        if (response?.type === 'success') {
          const { accessToken } = await AuthSession.exchangeCodeAsync(
            {
              clientId: appData.clientId,
              clientSecret: appData.clientSecret,
              scopes: ['read', 'write', 'follow', 'push'],
              redirectUri,
              code: response.params.code,
              extraParams: {
                grant_type: 'authorization_code'
              }
            },
            {
              tokenEndpoint: `https://${instanceDomain}/oauth/token`
            }
          )
          queryClient.clear()
          dispatch(
            addInstance({
              domain: instanceDomain,
              token: accessToken,
              instance,
              max_toot_chars: instance.max_toot_chars,
              appData
            })
          )
          goBack && navigation.goBack()
        }
      })()
    }, [response])

    return <></>
  },
  () => true
)

export default InstanceAuth
