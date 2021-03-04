import ComponentSeparator from '@components/Separator'
import { useScrollToTop } from '@react-navigation/native'
import { QueryKeyTimeline, useTimelineQuery } from '@utils/queryHooks/timeline'
import { getInstanceActive } from '@utils/slices/instancesSlice'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { RefObject, useCallback, useRef } from 'react'
import {
  FlatList,
  FlatListProps,
  Platform,
  RefreshControl,
  StyleSheet
} from 'react-native'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import TimelineEmpty from './Timeline/Empty'
import TimelineFooter from './Timeline/Footer'
import TimelineRefresh, {
  SEPARATION_Y_1,
  SEPARATION_Y_2
} from './Timeline/Refresh'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export interface Props {
  flRef?: RefObject<FlatList<any>>
  queryKey: QueryKeyTimeline
  disableRefresh?: boolean
  disableInfinity?: boolean
  customProps: Partial<FlatListProps<any>> &
    Pick<FlatListProps<any>, 'renderItem'>
}

const Timeline: React.FC<Props> = ({
  flRef: customFLRef,
  queryKey,
  disableRefresh = false,
  disableInfinity = false,
  customProps
}) => {
  // Switching account update timeline
  useSelector(getInstanceActive)

  const { theme } = useTheme()

  const {
    data,
    refetch,
    isFetching,
    isLoading,
    fetchNextPage,
    isFetchingNextPage
  } = useTimelineQuery({
    ...queryKey[1],
    options: {
      notifyOnChangeProps: Platform.select({
        ios: ['data', 'isFetching'],
        android: ['data', 'isFetching', 'isLoading']
      }),
      getNextPageParam: lastPage =>
        lastPage?.links?.next && { max_id: lastPage.links.next }
    }
  })

  const flattenData = data?.pages ? data.pages.flatMap(d => [...d.body]) : []

  const ItemSeparatorComponent = useCallback(
    ({ leadingItem }) =>
      queryKey[1].page === 'Toot' && queryKey[1].toot === leadingItem.id ? (
        <ComponentSeparator extraMarginLeft={0} />
      ) : (
        <ComponentSeparator
          extraMarginLeft={StyleConstants.Avatar.M + StyleConstants.Spacing.S}
        />
      ),
    []
  )
  const onEndReached = useCallback(
    () => !disableInfinity && !isFetchingNextPage && fetchNextPage(),
    [isFetchingNextPage]
  )

  const flRef = useRef<FlatList>(null)
  const scrollY = useSharedValue(0)
  const fetchingType = useSharedValue<0 | 1 | 2>(0)

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: ({ contentOffset: { y } }) => {
        scrollY.value = y
      },
      onEndDrag: ({ contentOffset: { y } }) => {
        if (!disableRefresh && !isFetching) {
          if (y <= SEPARATION_Y_2) {
            fetchingType.value = 2
          } else if (y <= SEPARATION_Y_1) {
            fetchingType.value = 1
          }
        }
      }
    },
    [isFetching]
  )

  const androidRefreshControl = Platform.select({
    android: {
      refreshControl: (
        <RefreshControl
          enabled
          colors={[theme.primary]}
          progressBackgroundColor={theme.background}
          refreshing={isFetching || isLoading}
          onRefresh={() => refetch()}
        />
      )
    }
  })

  useScrollToTop(flRef)
  return (
    <>
      <TimelineRefresh
        queryKey={queryKey}
        scrollY={scrollY}
        fetchingType={fetchingType}
        disableRefresh={disableRefresh}
      />
      <AnimatedFlatList
        // @ts-ignore
        ref={customFLRef || flRef}
        scrollEventThrottle={16}
        onScroll={onScroll}
        windowSize={8}
        data={flattenData}
        initialNumToRender={6}
        maxToRenderPerBatch={3}
        style={styles.flatList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        ListFooterComponent={
          <TimelineFooter
            queryKey={queryKey}
            disableInfinity={disableInfinity}
          />
        }
        ListEmptyComponent={<TimelineEmpty queryKey={queryKey} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0
        }}
        {...androidRefreshControl}
        {...customProps}
      />
    </>
  )
}

const styles = StyleSheet.create({
  flatList: {
    minHeight: '100%'
  }
})

export default Timeline
