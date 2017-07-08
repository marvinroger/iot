import {version} from '../package.json'

export const VERSION = version

function getUrl ({ws = false, port = null}) {
  const l = window.location
  let pathname = l.pathname
  if (pathname.endsWith('/')) pathname = pathname.slice(0, -1)
  return ((l.protocol === 'https:') ? (ws ? 'wss://' : 'https://') : (ws ? 'ws://' : 'http://')) + l.hostname + (port ? `:${port}` : (l.port === '' ? '' : `:${l.port}`)) + pathname
}

export const HTTP_API_URL = (process.env.NODE_ENV === 'production' ? getUrl() : getUrl({ port: 1234 })) + '/api'
export const WS_API_URL = (process.env.NODE_ENV === 'production' ? getUrl({ ws: true }) : getUrl({ ws: true, port: 1234 }))
