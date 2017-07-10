import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {generateMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {EVENT_TYPES} from '../../common/event-types'
import {ROOM_UPDATE_TYPES} from '../../common/room-update-types'

export class RequestResponder {
  constructor (wsBroadcaster, devicePool, roomModel, metaModel) {
    this._wsBroadcaster = wsBroadcaster
    this._devicePool = devicePool
    this._Room = roomModel.get()
    this._Meta = metaModel.get()
  }

  async handle ({ request, ws, user }) {
    const {method, parameters} = request
    const sendResponse = response => ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: request.id, response }))

    if (method === 'triggerAction') {
      const {action, deviceId, params} = parameters

      const device = this._devicePool.getDevice(deviceId)
      if (!device) return sendResponse(false)

      device.getPlugin().handleAction({
        deviceId,
        action,
        params
      })

      sendResponse(true)
    } else if (method === 'addRoom') {
      const {name} = parameters

      const room = await this._Room.forge({
        name
      }).save()

      const roomsPositions = await this._Meta.where({ key: 'roomsPositions' }).fetch()
      const position = {x: 0, y: 0, w: 2, h: 2, i: room.id.toString()}
      roomsPositions.attributes['value'].push(position)
      await roomsPositions.save()

      this._wsBroadcaster.broadcast(generateMessage({
        type: MESSAGE_TYPES.EVENT,
        event: EVENT_TYPES.ROOM_UPDATE,
        value: {
          type: ROOM_UPDATE_TYPES.ROOM_ADDED,
          id: room.id.toString(),
          name,
          position
        }
      }))

      sendResponse({
        id: room.id,
        name
      })
    } else if (method === 'updateRoomsPositions') {
      const {positions} = parameters

      const roomsPositions = await this._Meta.where({ key: 'roomsPositions' }).fetch()
      roomsPositions.attributes['value'] = positions
      await roomsPositions.save()

      this._wsBroadcaster.broadcast(generateMessage({
        type: MESSAGE_TYPES.EVENT,
        event: EVENT_TYPES.ROOM_UPDATE,
        value: {
          type: ROOM_UPDATE_TYPES.ROOM_POSITIONS_REPLACED,
          positions
        }
      }))

      sendResponse(true)
    }
  }
}

helpers.annotate(RequestResponder, [TYPES.WsBroadcaster, TYPES.DevicePool, TYPES.models.Room, TYPES.models.Meta])
