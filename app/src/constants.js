import {version} from '../package.json'

export const VERSION = version

function getUrl (ws) {
  const l = window.location
  return ((l.protocol === 'https:') ? (ws ? 'wss://' : 'https://') : (ws ? 'ws://' : 'http://')) + l.host + l.pathname
}

export const HTTP_API_URL = (process.env.NODE_ENV === 'production' ? getUrl(false) : 'http://127.0.0.1:1234') + '/api'
export const WS_API_URL = (process.env.NODE_ENV === 'production' ? getUrl(true) : 'ws://127.0.0.1:1234')
