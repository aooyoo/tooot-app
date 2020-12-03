import React from 'react'

import { useDispatch } from 'react-redux'
import { updateLocal } from 'src/utils/slices/instancesSlice'
import MenuButton from 'src/components/Menu/Button'
import { MenuContainer } from 'src/components/Menu'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const Logout: React.FC = () => {
  const { t } = useTranslation('meRoot')
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const alertOption = {
    title: t('content.logout.alert.title'),
    message: t('content.logout.alert.message'),
    buttons: [
      {
        text: t('content.logout.alert.buttons.logout'),
        style: 'destructive' as const,
        onPress: () => {
          dispatch(updateLocal({}))
          navigation.navigate('Screen-Public', {
            screen: 'Screen-Public-Root',
            params: { publicTab: true }
          })
        }
      },
      {
        text: t('content.logout.alert.buttons.cancel'),
        style: 'cancel' as const
      }
    ]
  }

  return (
    <MenuContainer>
      <MenuButton
        text={t('content.logout.button')}
        destructive={true}
        alertOption={alertOption}
      />
    </MenuContainer>
  )
}

export default Logout