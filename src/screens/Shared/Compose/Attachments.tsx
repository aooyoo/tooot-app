import React, { Dispatch, useCallback } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { PostAction, PostState } from '../Compose'
import { StyleConstants } from 'src/utils/styles/constants'
import { useTheme } from 'src/utils/styles/ThemeManager'
import { useNavigation } from '@react-navigation/native'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { ButtonRound } from 'src/components/Button'
import addAttachments from './addAttachments'

const DEFAULT_HEIGHT = 200

export interface Props {
  postState: PostState
  postDispatch: Dispatch<PostAction>
}

const ComposeAttachments: React.FC<Props> = ({ postState, postDispatch }) => {
  const { theme } = useTheme()
  const navigation = useNavigation()

  const renderAttachment = useCallback(
    ({
      item,
      index
    }: {
      item: Mastodon.Attachment & { local_url?: string }
      index: number
    }) => {
      return (
        <View key={index}>
          <Image
            style={[
              styles.image,
              {
                width:
                  ((item as Mastodon.AttachmentImage).meta?.original?.aspect ||
                    (item as Mastodon.AttachmentVideo).meta?.original.width! /
                      (item as Mastodon.AttachmentVideo).meta?.original
                        .height! ||
                    1) * DEFAULT_HEIGHT
              }
            ]}
            source={{
              uri:
                item.type === 'image'
                  ? item.local_url || item.preview_url
                  : item.preview_url
            }}
          />
          {(item as Mastodon.AttachmentVideo).meta?.original?.duration && (
            <Text
              style={[
                styles.duration,
                {
                  color: theme.background,
                  backgroundColor: theme.backgroundOverlay
                }
              ]}
            >
              {(item as Mastodon.AttachmentVideo).meta?.original.duration}
            </Text>
          )}
          <ButtonRound
            icon='x'
            onPress={() =>
              postDispatch({
                type: 'attachments',
                payload: postState.attachments.filter(e => e.id !== item.id)
              })
            }
            styles={styles.delete}
          />
          <ButtonRound
            icon='edit'
            onPress={() =>
              navigation.navigate('Screen-Shared-Compose-EditAttachment', {
                attachment: item,
                postDispatch
              })
            }
            styles={styles.edit}
          />
        </View>
      )
    },
    []
  )

  const listFooter = useCallback(() => {
    return (
      <ShimmerPlaceholder
        style={styles.progressContainer}
        visible={postState.attachmentUploadProgress === undefined}
        width={
          (postState.attachmentUploadProgress?.aspect || 3 / 2) * DEFAULT_HEIGHT
        }
        height={200}
      >
        {postState.attachments.length > 0 &&
          postState.attachments[0].type === 'image' &&
          postState.attachments.length < 4 && (
            <Pressable
              style={{
                width: DEFAULT_HEIGHT,
                height: DEFAULT_HEIGHT,
                backgroundColor: theme.border
              }}
              onPress={async () =>
                await addAttachments({ postState, postDispatch })
              }
            >
              <ButtonRound
                icon='upload-cloud'
                onPress={async () =>
                  await addAttachments({ postState, postDispatch })
                }
                styles={{
                  top:
                    (DEFAULT_HEIGHT -
                      StyleConstants.Spacing.Global.PagePadding) /
                    2,
                  left:
                    (DEFAULT_HEIGHT -
                      StyleConstants.Spacing.Global.PagePadding) /
                    2
                }}
                coordinate='center'
              />
            </Pressable>
          )}
      </ShimmerPlaceholder>
    )
  }, [postState.attachmentUploadProgress])

  return (
    <View style={styles.base}>
      <FlatList
        horizontal
        extraData={postState.attachmentUploadProgress}
        data={postState.attachments}
        renderItem={renderAttachment}
        ListFooterComponent={listFooter}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'row',
    marginRight: StyleConstants.Spacing.Global.PagePadding,
    height: DEFAULT_HEIGHT
  },
  image: {
    flex: 1,
    marginLeft: StyleConstants.Spacing.Global.PagePadding,
    marginTop: StyleConstants.Spacing.Global.PagePadding,
    marginBottom: StyleConstants.Spacing.Global.PagePadding
  },
  duration: {
    position: 'absolute',
    bottom:
      StyleConstants.Spacing.Global.PagePadding + StyleConstants.Spacing.S,
    left: StyleConstants.Spacing.Global.PagePadding + StyleConstants.Spacing.S,
    fontSize: StyleConstants.Font.Size.S,
    paddingLeft: StyleConstants.Spacing.S,
    paddingRight: StyleConstants.Spacing.S,
    paddingTop: StyleConstants.Spacing.XS,
    paddingBottom: StyleConstants.Spacing.XS
  },
  edit: {
    bottom:
      StyleConstants.Spacing.Global.PagePadding + StyleConstants.Spacing.S,
    right: StyleConstants.Spacing.S
  },
  delete: {
    top: StyleConstants.Spacing.Global.PagePadding + StyleConstants.Spacing.S,
    right: StyleConstants.Spacing.S
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: DEFAULT_HEIGHT,
    marginLeft: StyleConstants.Spacing.Global.PagePadding,
    marginTop: StyleConstants.Spacing.Global.PagePadding,
    marginBottom: StyleConstants.Spacing.Global.PagePadding
  }
})

export default React.memo(ComposeAttachments, () => true)
