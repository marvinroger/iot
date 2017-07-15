import {generateRequest, parseMessage, MESSAGE_TYPES} from '../../../common/ws-messages'

export function makeWsRequest ({ ws, method, parameters }) {
  return new Promise(function (resolve, reject) {
    const request = generateRequest(method, parameters)

    const removeWsListener = () => ws.removeListener('message', onMessage)

    let timeout
    const onMessage = function (message) {
      const parsed = parseMessage(message)

      if (parsed.type === MESSAGE_TYPES.RESPONSE && parsed.id === request.id) {
        resolve(parsed.value)
        window.clearTimeout(timeout)
        removeWsListener()
      }
    }

    timeout = window.setTimeout(function onTimeout () {
      reject(new Error('Response timeout'))
      removeWsListener()
    }, 2500)

    ws.on('message', onMessage)
    ws.send(request.text)
  })
}
