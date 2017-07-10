import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {EventEmitter} from 'events'

import {generateMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {EVENT_TYPES} from '../../common/event-types'

export class UpdateBus extends EventEmitter {
  constructor (wsBroadcaster) {
    super()

    this._wsBroadcaster = wsBroadcaster
  }

  notify (type, id, value) {
    this._wsBroadcaster.broadcast(generateMessage({
      type: MESSAGE_TYPES.EVENT,
      event: EVENT_TYPES.DEVICE_UPDATE,
      value
    }))
  }
}

helpers.annotate(EventEmitter)
helpers.annotate(UpdateBus, [TYPES.WsBroadcaster])
