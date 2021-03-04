import { RootState } from '@root/store'
import axios from 'axios'
import chalk from 'chalk'
import li from 'li'

const ctx = new chalk.Instance({ level: 3 })

export type Params = {
  method: 'get' | 'post' | 'put' | 'delete'
  version?: 'v1' | 'v2'
  url: string
  params?: {
    [key: string]: string | number | boolean
  }
  headers?: { [key: string]: string }
  body?: FormData
  onUploadProgress?: (progressEvent: any) => void
}

const apiInstance = async <T = unknown>({
  method,
  version = 'v1',
  url,
  params,
  headers,
  body,
  onUploadProgress
}: Params): Promise<{ body: T; links: { prev?: string; next?: string } }> => {
  const { store } = require('@root/store')
  const state = store.getState() as RootState
  const instanceActive = state.instances.instances.findIndex(
    instance => instance.active
  )

  let domain
  let token
  if (instanceActive !== -1 && state.instances.instances[instanceActive]) {
    domain = state.instances.instances[instanceActive].url
    token = state.instances.instances[instanceActive].token
  } else {
    console.error(
      ctx.bgRed.white.bold(' API ') + ' ' + 'No instance domain is provided'
    )
    return Promise.reject()
  }

  console.log(
    ctx.bgGreen.bold(' API instance ') +
      ' ' +
      domain +
      ' ' +
      method +
      ctx.green(' -> ') +
      `/${url}` +
      (params ? ctx.green(' -> ') : ''),
    params ? params : ''
  )

  return axios({
    timeout: method === 'post' ? 1000 * 60 : 1000 * 15,
    method,
    baseURL: `https://${domain}/api/${version}/`,
    url,
    params,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    },
    ...(body && { data: body }),
    ...(onUploadProgress && { onUploadProgress: onUploadProgress })
  })
    .then(response => {
      let prev
      let next
      if (response.headers.link) {
        const headersLinks = li.parse(response.headers.link)
        prev = headersLinks.prev?.match(/_id=([0-9]*)/)[1]
        next = headersLinks.next?.match(/_id=([0-9]*)/)[1]
      }
      return Promise.resolve({
        body: response.data,
        links: { prev, next }
      })
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          ctx.bold(' API instance '),
          ctx.bold('response'),
          error.response.status,
          error.response.data.error
        )
        return Promise.reject(error.response)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(ctx.bold(' API instance '), ctx.bold('request'), error)
        return Promise.reject()
      } else {
        console.error(
          ctx.bold(' API instance '),
          ctx.bold('internal'),
          error.message,
          url
        )
        return Promise.reject()
      }
    })
}

export default apiInstance
