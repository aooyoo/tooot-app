import { InfiniteData, QueryClient } from 'react-query'
import { MutationVarsTimelineDeleteItem } from '../timeline'

const deleteItem = ({
  queryClient,
  queryKey,
  rootQueryKey,
  id
}: {
  queryClient: QueryClient
  queryKey?: MutationVarsTimelineDeleteItem['queryKey']
  rootQueryKey?: MutationVarsTimelineDeleteItem['rootQueryKey']
  id: MutationVarsTimelineDeleteItem['id']
}) => {
  queryKey &&
    queryClient.setQueryData<InfiniteData<any> | undefined>(queryKey, old => {
      if (old) {
        old.pages = old.pages.map(page => {
          page.body = page.body.filter(
            (item: Mastodon.Status) => item.id !== id
          )
          return page
        })
        return old
      }
    })

  rootQueryKey &&
    queryClient.setQueryData<InfiniteData<any> | undefined>(
      rootQueryKey,
      old => {
        if (old) {
          old.pages = old.pages.map(page => {
            page.body = page.body.filter(
              (item: Mastodon.Status) => item.id !== id
            )
            return page
          })
          return old
        }
      }
    )
}

export default deleteItem
