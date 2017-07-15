import {helpers} from 'inversify-vanillajs-helpers'

import {EventEmitter} from 'events'

import {generateEvent} from '../../common/ws-messages'
import {EVENT_TYPES} from '../../common/event-types'

export class UpdateBus extends EventEmitter {
  notifyDeviceUpdate (payload) {
    this.emit('broadcast', generateEvent(
      EVENT_TYPES.DEVICE_UPDATE,
      payload
    ))
  }

  notifyRoomUpdate (payload) {
    this.emit('broadcast', generateEvent(
      EVENT_TYPES.ROOM_UPDATE,
      payload
    ))
  }
}

helpers.annotate(EventEmitter)
helpers.annotate(UpdateBus)
